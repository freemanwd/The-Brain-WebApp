"""Browser regression suite for the original game UI.

Runs generated HTML via set_content, requiring no browser navigation.
The test environment blocks browser navigation and opaque-origin storage,
so persistence tests explicitly use an in-memory localStorage test double.
These test serialization/recovery logic, not a browser's disk-backed store.
"""
import json
import os
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
HTML = ROOT.parent / 'the-brain.html'
if not HTML.exists():
    import sys
    sys.path.insert(0, str(ROOT))
    from build import build
    build()
TEXT = HTML.read_text(encoding='utf-8')
ARTIFACTS = Path(os.environ.get('BRAIN_QA_OUTPUT', str(ROOT.parent)))
ARTIFACTS.mkdir(parents=True, exist_ok=True)
KEY = 'the-brain-game-v1'
RESULTS=[]
ERRORS=[]


def passed(name):
    RESULTS.append(name)
    print('PASS:', name, flush=True)


def new_page(browser, width=1440, height=1000, storage=None, fallback=False, touch=False):
    page=browser.new_page(viewport={'width':width,'height':height},
                          device_scale_factor=1, is_mobile=touch, has_touch=touch,
                          accept_downloads=True)
    page.set_default_timeout(5000)
    page.on('pageerror', lambda err: ERRORS.append(str(err)))
    if not fallback:
        page.evaluate('''initial => {
          const store = new Map(Object.entries(initial || {}));
          Object.defineProperty(window, 'localStorage', {configurable:true, value:{
            getItem:key => store.has(key) ? store.get(key) : null,
            setItem:(key,value) => store.set(key,String(value)),
            removeItem:key => store.delete(key), clear:() => store.clear(),
            key:i => [...store.keys()][i] || null,
            get length(){return store.size;}
          }});
        }''', storage or {})
    page.set_content(TEXT, wait_until='load')
    return page


def snapshot(page):
    return page.evaluate('BrainGame.getSnapshot()')


def nav(page, view):
    page.locator(f'nav [data-action="go"][data-view="{view}"]').click()


def assess(page, case_id):
    nav(page, 'hospital')
    page.locator(f'[data-action="case"][data-id="{case_id}"]').click()
    for e in ['history','mental','pupils','motor']:
        page.locator(f'[data-action="exam"][data-id="{e}"]').click()


def workup(page, case_id, diagnosis, plan, tests):
    assess(page, case_id)
    for test in tests:
        page.locator(f'[data-action="order"][data-id="{test}"]').click()
        page.locator('[data-action="review-study"]').click()
        nav(page,'chart')
    page.locator('#diagnosis').select_option(diagnosis)
    page.locator('[data-action="diagnose"]').click()
    assert snapshot(page)['cases'][case_id]['phase']=='diagnosed'
    page.locator('#plan').select_option(plan)
    page.locator('[data-action="commit-plan"]').click()
    assert page.locator('#check-submit').is_disabled()
    for check in page.locator('[data-check]').all():
        check.check()
    assert page.locator('#check-submit').is_enabled()
    page.locator('#check-submit').click()


def finish_operation(page, case_id, procedure, start=0):
    tools=['scalpel','drill','retractor',{'hematoma':'suction','tumor':'forceps','aneurysm':'clip'}[procedure],'bipolar','suture']
    for stage in range(start,6):
        assert snapshot(page)['cases'][case_id]['op']['stage']==stage
        page.locator(f'[data-action="tool"][data-id="{tools[stage]}"]').click()
        # Resolve the targets for this stage before clicking them; new-stage buttons
        # must not be picked up by the same loop.
        targets=page.locator('.op-target:not(:disabled)').all()
        for index in range(len(targets)):
            page.locator(f'.op-target[data-stage="{stage}"]:not(:disabled)').first.click()
    assert snapshot(page)['cases'][case_id]['phase']=='complete'


def no_overflow(page):
    return page.evaluate('document.documentElement.scrollWidth <= innerWidth')


def run():
    with sync_playwright() as p:
        executable=os.environ.get('CHROMIUM_PATH') or shutil.which('chromium') or shutil.which('google-chrome')
        launch={'headless':True,'args':['--no-sandbox']}
        if executable: launch['executable_path']=executable
        browser=p.chromium.launch(**launch)
        page=new_page(browser)
        assert page.locator('.patient-card').count()==6
        assert no_overflow(page)
        page.screenshot(path=str(ARTIFACTS/'the-brain-preview.png'),full_page=True)
        passed('Hospital board: six fictional patients and desktop layout')
        nav(page,'theatre')
        assert page.locator('.empty-state').count()==1
        nav(page,'chart')
        assert page.locator('.empty-state').count()==1
        passed('Locked/empty pathways before selecting a patient')

        # Deliberately exercise gates and wrong answers on the first case.
        assess(page,'morgan')
        page.locator('#diagnosis').select_option('acute-sdh')
        page.locator('[data-action="diagnose"]').click()
        assert snapshot(page)['cases']['morgan']['phase']=='investigating'
        page.locator('[data-action="order"][data-id="ct"]').click()
        nav(page,'chart')
        page.locator('[data-action="diagnose"]').click()
        assert snapshot(page)['cases']['morgan']['phase']=='investigating'
        nav(page,'imaging')
        page.locator('#slice').fill('18')
        assert page.locator('#slice-caption').inner_text()=='SL 18/20'
        page.locator('[data-action="annotate"]').click()
        page.locator('[data-action="review-study"]').click()
        assert page.locator('[data-action="review-study"]').is_disabled()
        nav(page,'chart')
        passed('Imaging order/review gate, slider and annotations')
        page.locator('#diagnosis').select_option('epidural')
        page.locator('[data-action="diagnose"]').click()
        assert snapshot(page)['cases']['morgan']['wrongDx']==1
        page.locator('#diagnosis').select_option('acute-sdh')
        page.locator('[data-action="diagnose"]').click()
        page.locator('#plan').select_option('observe')
        page.locator('[data-action="commit-plan"]').click()
        assert snapshot(page)['cases']['morgan']['wrongPlan']==1
        page.locator('#plan').select_option('evacuate')
        page.locator('[data-action="commit-plan"]').click()
        assert page.locator('#check-submit').is_disabled()
        for chk in page.locator('[data-check]').all():chk.check()
        page.locator('#check-submit').click()
        passed('Wrong diagnosis/management feedback and mandatory time-out')

        page.locator('.op-target[data-target="1"]').click()
        assert snapshot(page)['cases']['morgan']['op']['misses']==1
        page.wait_for_timeout(280)
        page.keyboard.press('2')
        page.locator('.op-target[data-target="0"]').click()
        assert snapshot(page)['cases']['morgan']['op']['misses']==2
        page.locator('[data-action="assist"]').click()
        assert snapshot(page)['cases']['morgan']['op']['assistUsed']
        assert page.locator('[data-action="assist"]').is_disabled()
        page.keyboard.press('1')
        target=page.locator('.op-target[data-target="0"]')
        target.focus();page.keyboard.press('Enter')
        assert snapshot(page)['cases']['morgan']['op']['done']==[0]
        page.keyboard.press('p')
        before=snapshot(page)['cases']['morgan']['op']['time']
        page.wait_for_timeout(300)
        assert snapshot(page)['cases']['morgan']['op']['time']==before
        page.keyboard.press('p')
        page.locator('[data-action="hint"]').click()
        before=snapshot(page)['cases']['morgan']['op']['time']
        page.wait_for_timeout(250)
        assert snapshot(page)['cases']['morgan']['op']['time']==before
        page.locator('#modal [data-action="close-modal"]').first.click()
        passed('Target order, instrument errors, keyboard actions, pause and hint dialog')
        finish_operation(page,'morgan','hematoma')
        rec=snapshot(page)['records'][-1]
        assert rec['score']==76, rec
        assert rec['grade']=='C' and rec['misses']==2
        passed('First complete operation and deterministic scoring (76/100)')

        for cid,dx,plan,tests,proc in [
            ('chen','tumor','resect',['mri'],'tumor'),
            ('ortiz','sah','secure',['ct','cta'],'aneurysm'),
            ('reed','stroke','stroke-team',['ct','cta'],None),
            ('brooks','migraine','medical',[],None),
            ('bell','chronic-sdh','evacuate',['ct'],'hematoma')]:
            workup(page,cid,dx,plan,tests)
            if proc:
                finish_operation(page,cid,proc)
            assert snapshot(page)['cases'][cid]['phase']=='complete'
            assert snapshot(page)['records'][-1]['score']==100
            passed(f'Complete case: {cid}; appropriate {proc or "nonoperative"} pathway')
        nav(page,'journal')
        assert page.locator('tbody tr').count()==6
        page.locator('[data-action="record"]').first.click()
        assert snapshot(page)['view']=='debrief'
        with page.expect_download(timeout=5000) as dl:
            page.locator('[data-action="export"]').click()
        download=dl.value
        download.save_as(str(ARTIFACTS/'the-brain-example-log.json'))
        exported=json.loads((ARTIFACTS/'the-brain-example-log.json').read_text())
        assert len(exported['attempts'])==6
        passed('Case log, individual debrief lookup and JSON export')

        # New attempt; serialize real game state via its own save logic.
        nav(page,'hospital')
        page.locator('[data-action="case"][data-id="morgan"]').click()
        page.locator('[data-action="replay"]').click()
        page.locator('[data-action="confirm-replay"]').click()
        assert len(snapshot(page)['records'])==6
        for e in ['history','mental','pupils','motor']:
            page.locator(f'[data-action="exam"][data-id="{e}"]').click()
        page.locator('[data-action="order"][data-id="ct"]').click()
        page.locator('[data-action="review-study"]').click();nav(page,'chart')
        page.locator('#diagnosis').select_option('acute-sdh');page.locator('[data-action="diagnose"]').click()
        page.locator('#plan').select_option('evacuate');page.locator('[data-action="commit-plan"]').click()
        for chk in page.locator('[data-check]').all():chk.check()
        page.locator('#check-submit').click()
        for i in range(4):page.locator('.op-target:not(:disabled)').first.click()
        saved=page.evaluate(f'localStorage.getItem("{KEY}")')
        resumed=new_page(browser,storage={KEY:saved})
        s=snapshot(resumed)
        assert s['cases']['morgan']['op']['stage']==1
        assert s['cases']['morgan']['op']['paused']
        assert len(s['records'])==6
        resumed.locator('.pause-overlay [data-action="pause"]').click()
        finish_operation(resumed,'morgan','hematoma',start=1)
        assert len(snapshot(resumed)['records'])==7
        passed('Replay, save serialization, fresh-context resume paused, and completion')

        # Challenge timing and failure/recovery path.
        challenge=new_page(browser)
        challenge.locator('#mode').select_option('challenge')
        workup(challenge,'morgan','acute-sdh','evacuate',['ct'])
        health=snapshot(challenge)['cases']['morgan']['op']['health']
        challenge.wait_for_timeout(400)
        assert snapshot(challenge)['cases']['morgan']['op']['health']<health
        challenge.locator('#mode').select_option('guided')
        assert snapshot(challenge)['cases']['morgan']['op']['mode']=='challenge'
        nav(challenge,'academy')
        health=snapshot(challenge)['cases']['morgan']['op']['health']
        challenge.wait_for_timeout(300)
        assert snapshot(challenge)['cases']['morgan']['op']['health']==health
        nav(challenge,'theatre')
        challenge.locator('[data-action="tool"][data-id="drill"]').click()
        for i in range(14):
            if snapshot(challenge)['view']=='debrief':break
            challenge.locator('.op-target').first.click()
            challenge.wait_for_timeout(275)
        ss=snapshot(challenge)
        assert ss['cases']['morgan']['phase']=='failed'
        assert not ss['records'][-1]['success'] and ss['records'][-1]['score']<=49
        passed('Challenge drain, frozen mode, off-screen pause and failure debrief')

        # Mobile touch paths, checks for overflow and actual target hit areas.
        mobile=new_page(browser,width=390,height=844,touch=True)
        assert no_overflow(mobile)
        mobile.screenshot(path=str(ARTIFACTS/'the-brain-mobile-home.png'),full_page=True)
        workup(mobile,'chen','tumor','resect',['mri'])
        for stage,tool in [(0,'scalpel'),(1,'drill'),(2,'retractor')]:
            mobile.locator(f'[data-action="tool"][data-id="{tool}"]').click()
            for _ in mobile.locator('.op-target:not(:disabled)').all():
                mobile.locator(f'.op-target[data-stage="{stage}"]:not(:disabled)').first.tap()
        assert no_overflow(mobile)
        bounds=mobile.locator('.op-target').evaluate_all('(els)=>els.map(e=>({w:e.offsetWidth,h:e.offsetHeight}))')
        assert all(b['w']>=44 and b['h']>=44 for b in bounds)
        mobile.wait_for_timeout(4300)
        mobile.screenshot(path=str(ARTIFACTS/'the-brain-mobile-theatre.png'),full_page=True)
        # Use the real mobile UI state in a larger render for a clean theatre preview.
        data=mobile.evaluate(f'localStorage.getItem("{KEY}")')
        art=new_page(browser,width=1440,height=1060,storage={KEY:data})
        art.locator('.pause-overlay [data-action="pause"]').click()
        art.screenshot(path=str(ARTIFACTS/'the-brain-theatre-preview.png'),full_page=True)
        finish_operation(mobile,'chen','tumor',start=3)
        assert no_overflow(mobile)
        for view in ['chart','imaging','academy','journal','hospital']:
            nav(mobile,view);assert no_overflow(mobile),view
        mobile.set_viewport_size({'width':320,'height':740})
        nav(mobile,'hospital');assert no_overflow(mobile)
        passed('Touch workflow, 44px targets, and responsive layouts at 390px and 320px')

        # Real blocked-storage fallback (no test double).
        fallback=new_page(browser,fallback=True)
        assert fallback.locator('.notice').count()==1
        workup(fallback,'brooks','migraine','medical',[])
        assert snapshot(fallback)['cases']['brooks']['phase']=='complete'
        passed('Storage-unavailable fallback still completes a full nonoperative case')
        corrupt=new_page(browser,storage={KEY:'{invalid json'})
        assert corrupt.locator('.patient-card').count()==6
        passed('Invalid saved JSON recovers to a usable game')

        # Reset confirmation protects the save until explicitly confirmed.
        nav(resumed,'journal');resumed.locator('[data-action="reset"]').click()
        resumed.locator('#modal [data-action="close-modal"]').last.click()
        assert len(snapshot(resumed)['records'])==7
        resumed.locator('[data-action="reset"]').click()
        resumed.locator('[data-action="confirm-reset"]').click()
        assert snapshot(resumed)['records']==[] and snapshot(resumed)['current'] is None
        passed('Reset confirmation, cancel protection, and full reset')
        assert not ERRORS, ERRORS
        passed('No uncaught JavaScript errors across the regression runs')
        browser.close()
    report={
        'status':'passed',
        'checks':RESULTS,
        'uncaughtJavaScriptErrors':ERRORS,
        'environment':'Chromium; generated HTML rendered with Playwright set_content',
        'limits':[
            'Browser navigation is restricted in the test environment; no public URL was deployed.',
            'Save/resume tests used an in-memory localStorage test double. Disk-backed storage and native file navigation were not validated here.',
            'Hosted service-worker offline/install behavior was not browser-tested in this environment.',
            'Mobile checks used Chromium touch emulation, not physical Safari/iOS devices.',
            'No clinical validation or educational-outcome validation has been performed.'
        ]
    }
    (ROOT/'tests'/'test-results.json').write_text(json.dumps(report,indent=2))
    print(f'\n{len(RESULTS)} regression checks passed.',flush=True)

if __name__=='__main__':run()
