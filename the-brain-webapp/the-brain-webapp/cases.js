/* Fictional case definitions. Clinical descriptions are deliberately simplified.
   Review by a qualified faculty team is required before educational deployment. */
'use strict';
window.BRAIN_DATA = {
  version: 1,
  exams: [
    {id:'history', label:'Take a history', sub:'Onset, context & medications', icon:'clipboard'},
    {id:'mental', label:'Mental status', sub:'Alertness, orientation & language', icon:'brain'},
    {id:'pupils', label:'Pupils & eye movements', sub:'Size, response & symmetry', icon:'eye'},
    {id:'motor', label:'Motor & sensation', sub:'Strength, drift & asymmetry', icon:'activity'}
  ],
  tests: [
    {id:'ct',name:'CT head',description:'Noncontrast • structural survey',icon:'scan'},
    {id:'mri',name:'MRI brain',description:'Soft-tissue characterization',icon:'brain'},
    {id:'cta',name:'CT angiography',description:'Intracranial vascular survey',icon:'activity'}
  ],
  diagnoses: [
    {id:'acute-sdh',label:'Acute subdural hematoma'},
    {id:'tumor',label:'Dural-based tumor / suspected meningioma'},
    {id:'sah',label:'Aneurysmal subarachnoid hemorrhage'},
    {id:'stroke',label:'Acute ischemic stroke'},
    {id:'migraine',label:'Migraine with visual aura'},
    {id:'chronic-sdh',label:'Chronic subdural hematoma'},
    {id:'epidural',label:'Epidural hematoma'},
    {id:'hydrocephalus',label:'Primary obstructive hydrocephalus'}
  ],
  plans: [
    {id:'evacuate',label:'Neurosurgical assessment → hematoma evacuation'},
    {id:'resect',label:'Neurosurgical planning → tumor resection'},
    {id:'secure',label:'Cerebrovascular team → secure ruptured aneurysm'},
    {id:'stroke-team',label:'Emergency stroke / endovascular team handoff'},
    {id:'medical',label:'Symptom management, reassessment & safety-netting'},
    {id:'observe',label:'Observation alone without specialist review'}
  ],
  tools:[
    {id:'scalpel',name:'Scalpel',key:'1',icon:'scalpel'},
    {id:'drill',name:'Drill',key:'2',icon:'drill'},
    {id:'retractor',name:'Retractor',key:'3',icon:'retractor'},
    {id:'suction',name:'Suction',key:'4',icon:'suction'},
    {id:'bipolar',name:'Bipolar',key:'5',icon:'bipolar'},
    {id:'forceps',name:'Forceps',key:'6',icon:'forceps'},
    {id:'clip',name:'Clip',key:'7',icon:'clip'},
    {id:'suture',name:'Suture',key:'8',icon:'suture'}
  ],
  references:[
    {title:'Original inspiration: Life and Death 2 — The Brain (ClassicReload)',url:'https://classicreload.com/life-and-death-2-the-brain.html',note:'Game title and DOS-era neurosurgery premise only; no assets or code copied.'},
    {title:'NHS — Subdural haematoma',url:'https://www.nhs.uk/conditions/subdural-haematoma/',note:'Background on traumatic presentations and specialist treatment.'},
    {title:'AANS — Brain tumors',url:'https://www.aans.org/patients/conditions-treatments/brain-tumors/',note:'General background on tumor evaluation and care.'},
    {title:'AANS — Cerebral aneurysm',url:'https://www.aans.org/patients/conditions-treatments/cerebral-aneurysm/',note:'General background on rupture and clipping/coiling. Not a current practice guideline.'}
  ],
  cases:[
    {
      id:'morgan',bed:'01',name:'Elias Morgan',age:68,sex:'M',color:'#bd987d',hair:'#b9b9a4',
      priority:'critical',location:'Emergency department',
      complaint:'A fall. A worsening headache. Now, increasing drowsiness.',
      quote:'“He was talking after the fall. Now he barely answers me.”',
      intro:'A family member brings Elias in after a fall earlier today. The triage team reports worsening responsiveness and new left-sided weakness. The team is already providing initial stabilization while you review the case.',
      diagnosis:'acute-sdh',plan:'evacuate',procedure:'hematoma',required:['ct'],
      vitals:{hr:58,bp:'172/92',spo2:97,gcs:12},
      findings:{
        history:'Head injury three hours ago with progressive headache and confusion. Takes apixaban for atrial fibrillation. Baseline independent. Medication-related bleeding risk needs immediate team review.',
        mental:'Drowsy, opens eyes to voice, uses inappropriate words, follows simple commands. GCS 12 in this fictional examination (E3 V3 M6).',
        pupils:'Right pupil 5 mm and sluggish; left pupil 3 mm and reactive. This is a concerning asymmetry.',
        motor:'Left arm and leg weaker than the right. Left pronator drift. Right-sided movement remains purposeful.'
      },
      studies:{
        ct:{finding:'Hyperdense crescentic extra-axial collection over the right cerebral convexity. Maximum thickness 14 mm with 8 mm leftward midline shift. These measurements belong only to this fictional case.',impression:'Acute right subdural hematoma with mass effect. Urgent neurosurgical attention is needed.',visual:'acute-sdh'},
        mri:{finding:'A right extra-axial blood collection and associated mass effect are again visible. MRI adds no necessary first-line information to this urgent fictional scenario.',impression:'Do not let additional imaging delay the urgent pathway already supported by CT.',visual:'acute-sdh'},
        cta:{finding:'No focal intracranial arterial aneurysm is identified in this simplified study. The right-sided extra-axial collection remains visible on the associated structural images.',impression:'Vascular imaging is not required to establish this case’s diagnosis.',visual:'normal-vessel'}
      },
      hint:'Match the traumatic history, asymmetric examination, and crescent-shaped collection. The CT—not the game’s timer—establishes the urgency.',
      rationale:'The traumatic onset, progressive decline and crescentic acute extra-axial blood identify an acute subdural hematoma. The degree of mass effect in this fictional patient supports urgent neurosurgical intervention.',
      nuance:'Real care also requires resuscitation, anticoagulation review or reversal when indicated, perioperative planning and neurocritical monitoring. None of these is represented adequately by an arcade stability meter.',
      operationNote:'The team has selected an evacuation pathway for this fictional right-sided hematoma. The interactive field is a generic schematic, not an operative map.',
      recovery:'Simulation handoff completed to neurocritical care after hematoma evacuation. A completed level does not predict a real neurological outcome.'
    },
    {
      id:'chen',bed:'02',name:'Amara Chen',age:46,sex:'F',color:'#c69576',hair:'#292b28',
      priority:'urgent',location:'Neurology consult',
      complaint:'Weeks of headaches, then an unfamiliar seizure.',
      quote:'“My left hand started moving on its own. I could not stop it.”',
      intro:'Amara presents after a first focal motor seizure. She reports increasingly frequent headaches over several weeks and subtle difficulty using her left hand. She is awake and comfortable after the acute event.',
      diagnosis:'tumor',plan:'resect',procedure:'tumor',required:['mri'],
      vitals:{hr:76,bp:'132/80',spo2:99,gcs:15},
      findings:{
        history:'Several weeks of increasing headache and new left-hand clumsiness. A witnessed focal motor seizure has resolved. No known cancer history or recent head injury.',
        mental:'Alert and fully oriented. Fluent language. Recalls the event and follows complex commands. GCS 15.',
        pupils:'Pupils equal and reactive. Eye movements full. No acute cranial nerve asymmetry.',
        motor:'Mild left arm weakness and pronator drift. Right side full strength. Sensation grossly preserved.'
      },
      studies:{
        ct:{finding:'A well-circumscribed right frontal extra-axial mass with surrounding edema. No acute intracranial hemorrhage.',impression:'A structural lesion requires further characterization with MRI.',visual:'tumor'},
        mri:{finding:'A strongly enhancing, dural-based right frontal mass with surrounding edema and local compression. Appearance is suggestive of a meningioma.',impression:'Suspected meningioma. Imaging does not establish a definitive histological diagnosis.',visual:'tumor'},
        cta:{finding:'Major intracranial arteries are patent on this schematic vascular survey. Local vascular anatomy is not resolved by the game.',impression:'Not required for the diagnostic puzzle. Real preoperative vascular assessment is individualized.',visual:'normal-vessel'}
      },
      hint:'Think about a slowly evolving structural cause of a first focal seizure. Characterize the dural-based lesion before deciding.',
      rationale:'The progressive symptoms, focal seizure and dural-based enhancing mass support a suspected meningioma. In this fictional case, the specialist team selects a planned resection pathway.',
      nuance:'Definitive diagnosis depends on tissue and pathology where obtained. Observation, surgery and other treatments depend on the patient, anatomy, growth and symptoms. The game does not model functional mapping or real resection boundaries.',
      operationNote:'A specialist team has reviewed this symptomatic fictional tumor and selected resection. Green game markers do not define safe tissue margins.',
      recovery:'Simulation handoff completed following the tumor level. Pathology review, neurological reassessment and follow-up remain necessary in actual care.'
    },
    {
      id:'ortiz',bed:'03',name:'Lena Ortiz',age:52,sex:'F',color:'#b98061',hair:'#312721',
      priority:'critical',location:'Emergency department',
      complaint:'A sudden, severe headache unlike anything before.',
      quote:'“It hit all at once. The worst headache of my life.”',
      intro:'Lena develops an abrupt severe headache while exercising. She has vomited twice and finds neck movement uncomfortable. She is awake but distressed. The emergency team is monitoring her while you review the workup.',
      diagnosis:'sah',plan:'secure',procedure:'aneurysm',required:['ct','cta'],
      vitals:{hr:86,bp:'164/88',spo2:98,gcs:14},
      findings:{
        history:'Abrupt headache reaching maximal intensity immediately, 45 minutes before arrival. Associated vomiting. No reported head injury or prior similar episode.',
        mental:'Awake, with mild confusion in the fictional assessment. Follows commands. GCS 14 (E4 V4 M6).',
        pupils:'Pupils equal and reactive. Eye movements intact. Neck discomfort is reported; do not use this alone to make the diagnosis.',
        motor:'Moves all four limbs without an obvious focal weakness. The absence of weakness does not exclude a dangerous intracranial hemorrhage.'
      },
      studies:{
        ct:{finding:'Hyperdense material within the basal cisterns and right sylvian fissure. The blood follows the subarachnoid spaces rather than forming a convexity crescent.',impression:'Subarachnoid hemorrhage. Additional vascular evaluation is needed in this case.',visual:'sah'},
        mri:{finding:'The game’s structural representation again shows subarachnoid blood. MRI is not required for this established acute CT-positive puzzle.',impression:'Do not delay the cerebrovascular pathway to obtain a nonessential game study.',visual:'sah'},
        cta:{finding:'A focal saccular dilation at the right middle cerebral artery bifurcation is represented on this simplified vascular schematic.',impression:'Ruptured right MCA aneurysm is the presumed source of the CT-demonstrated hemorrhage.',visual:'aneurysm'}
      },
      hint:'The sudden maximal-onset headache and cisternal blood suggest one diagnosis. Use vascular imaging to identify the source.',
      rationale:'Thunderclap onset with CT-demonstrated subarachnoid blood and a corresponding aneurysm supports aneurysmal subarachnoid hemorrhage. The appropriate disposition is an urgent cerebrovascular pathway.',
      nuance:'Clipping is selected by the fictional multidisciplinary team to create a playable level. Endovascular treatment is also a major real-world option; the game does not imply clipping is universally preferred or model vasospasm, DCI or critical care.',
      operationNote:'For this fictional anatomy, the cerebrovascular team has selected clipping. Coiling and other real options are not simulated. The illustrated vessels are not an anatomical reconstruction.',
      recovery:'Simulation handoff completed following aneurysm securing. Actual SAH care continues well beyond the procedure, including neurocritical surveillance.'
    },
    {
      id:'reed',bed:'04',name:'Noah Reed',age:71,sex:'M',color:'#906e57',hair:'#abb1a2',
      priority:'critical',location:'Stroke alert',
      complaint:'Sudden difficulty speaking and right-sided weakness.',
      quote:'“He was fine at breakfast. Then the words would not come.”',
      intro:'Noah arrives with abrupt language difficulty and weakness of his right face and arm. A witness can identify the last-known-well time. The emergency stroke team is already being activated in parallel with this simplified assessment.',
      diagnosis:'stroke',plan:'stroke-team',procedure:null,required:['ct','cta'],
      vitals:{hr:92,bp:'178/96',spo2:97,gcs:14},
      findings:{
        history:'Last known well 55 minutes before arrival. Abrupt focal deficits without trauma. Medication history and treatment contraindications require rapid team review.',
        mental:'Awake with impaired naming and reduced verbal output. Follows some simple commands. A full stroke severity assessment is not modeled.',
        pupils:'Pupils equal and reactive. A left gaze preference is present.',
        motor:'Right facial weakness and right arm greater than leg weakness. Left side moves normally. Glucose has been checked by the fictional receiving team and is not low.'
      },
      studies:{
        ct:{finding:'No acute hemorrhage. Subtle left insular gray-white loss may represent early ischemic change.',impression:'The absence of hemorrhage does not exclude acute ischemic stroke. Continue the emergency stroke pathway.',visual:'stroke'},
        mri:{finding:'A schematic area of diffusion restriction in the left MCA territory. The game does not simulate a real diffusion sequence.',impression:'Compatible with ischemia. This optional study must not delay time-critical treatment evaluation.',visual:'stroke'},
        cta:{finding:'Abrupt cutoff of the left proximal middle cerebral artery is shown on the vascular schematic.',impression:'Left MCA large-vessel occlusion. Urgent stroke/endovascular evaluation is appropriate.',visual:'stroke-vessel'}
      },
      hint:'Not every patient needs an open operation. Acute focal deficits and a vessel occlusion call for the emergency stroke team.',
      rationale:'The abrupt focal deficits, CT without hemorrhage and left MCA occlusion identify an acute ischemic stroke. This level rewards prompt handoff for reperfusion eligibility assessment, not a craniotomy.',
      nuance:'Real care includes rapid parallel assessment of eligibility for intravenous and/or endovascular reperfusion, imaging selection, contraindications and local protocols. This game deliberately gives no drug doses or treatment-window rules.',
      recovery:'Structured simulation handoff completed to the stroke/endovascular team. Eligibility and treatment decisions belong to that specialist pathway.',
      handoff:[
        ['Activate the emergency stroke team','Communicate the focal deficit pattern and large-vessel occlusion.'],
        ['Communicate last known well','Pass on the witnessed onset, imaging, medication history and glucose result.'],
        ['Request rapid reperfusion eligibility review','Do not delay specialist evaluation for optional game tests.'],
        ['Complete a structured handoff','Confirm the receiving team has the case and monitoring continues.']
      ]
    },
    {
      id:'brooks',bed:'05',name:'Maya Brooks',age:29,sex:'F',color:'#976749',hair:'#242322',
      priority:'routine',location:'Outpatient consult',
      complaint:'A familiar visual shimmer, followed by a headache.',
      quote:'“It starts with zigzags, then the headache. It has happened before.”',
      intro:'Maya describes a recurrent pattern of gradually spreading visual symptoms followed by headache and light sensitivity. The symptoms match her established prior episodes. No concerning new features are reported in this deliberately low-risk fictional case.',
      diagnosis:'migraine',plan:'medical',procedure:null,required:[],
      vitals:{hr:72,bp:'118/74',spo2:99,gcs:15},
      findings:{
        history:'Repeated stereotyped episodes of gradually spreading visual aura followed by headache and light sensitivity. No thunderclap onset, fever, trauma, pregnancy-related concern, or new pattern is present in this fictional history.',
        mental:'Alert, oriented and fluent. Normal recall and comprehension. GCS 15.',
        pupils:'Pupils equal and reactive. Eye movements and bedside visual examination are normal after the aura resolves.',
        motor:'Symmetric strength, no drift and intact sensation. Gait is steady in the fictional assessment.'
      },
      studies:{
        ct:{finding:'No acute abnormality on this synthetic structural illustration.',impression:'Routine imaging is not required for the intended low-risk, typical recurrent migraine puzzle. A normal scan alone cannot establish a migraine diagnosis.',visual:'normal'},
        mri:{finding:'No focal lesion in this synthetic representation.',impression:'The case is diagnosed from the clinical pattern, not by an MRI finding.',visual:'normal'},
        cta:{finding:'No focal vascular abnormality is represented.',impression:'Vascular imaging is not necessary for the intended low-risk case.',visual:'normal-vessel'}
      },
      hint:'Use the familiar, gradually evolving pattern and a normal examination. More testing and more surgery are not always better.',
      rationale:'A stereotyped recurrent visual aura followed by headache, with a normal examination and no stated red flags, supports migraine with aura in this fictional case. No operation is indicated.',
      nuance:'Real evaluation must be individualized. New, thunderclap, atypical or changing headaches and concerning associated features need reassessment. A normal synthetic scan is not a clinical reassurance tool.',
      recovery:'Simulation care plan completed with reassessment, follow-up and explicit return precautions; no surgical procedure was performed.',
      handoff:[
        ['Confirm the established clinical pattern','Recheck that no new concerning features were overlooked.'],
        ['Discuss an individualized symptom plan','The game does not prescribe medications or doses.'],
        ['Reassess symptoms and function','Confirm a safe, appropriate disposition with the treating clinician.'],
        ['Provide follow-up and safety-netting','New neurological deficits or a sudden severe headache require urgent reassessment.']
      ]
    },
    {
      id:'bell',bed:'06',name:'Arthur Bell',age:77,sex:'M',color:'#c2a18a',hair:'#d0cec0',
      priority:'urgent',location:'Neurology consult',
      complaint:'A slower walk and a foggy memory over several weeks.',
      quote:'“He has not quite been himself since that small fall.”',
      intro:'Arthur’s family has noticed increasing forgetfulness and an unsteady gait. They recall a minor fall several weeks earlier. He is awake and conversational, but has been less independent than usual.',
      diagnosis:'chronic-sdh',plan:'evacuate',procedure:'hematoma',required:['ct'],
      vitals:{hr:70,bp:'144/82',spo2:98,gcs:14},
      findings:{
        history:'Minor head injury five weeks ago, followed by slowly progressive gait and cognitive changes. Medication and bleeding-risk review is needed.',
        mental:'Awake with slowed responses and mild disorientation to date. GCS 14 (E4 V4 M6).',
        pupils:'Pupils equal and reactive. No obvious cranial nerve palsy.',
        motor:'Mild right arm drift and a cautious, broad-based gait in this fictional examination.'
      },
      studies:{
        ct:{finding:'Hypodense crescentic extra-axial collection along the left convexity with local compression and 6 mm rightward midline shift.',impression:'Chronic left subdural hematoma with mass effect in a symptomatic patient.',visual:'chronic-sdh'},
        mri:{finding:'A left-sided extra-axial collection with signal characteristics compatible with older blood products. The game does not reproduce sequence-dependent signal changes.',impression:'Supports the chronic collection already identified on CT.',visual:'chronic-sdh'},
        cta:{finding:'No focal arterial abnormality is represented. A chronic extra-axial collection is not diagnosed by vascular imaging alone.',impression:'Not required for this case’s diagnostic puzzle.',visual:'normal-vessel'}
      },
      hint:'The time course is different from the first trauma case. Match the delayed symptoms and darker crescentic collection.',
      rationale:'Weeks of progressive symptoms after a minor injury, together with a low-density crescentic collection, support a chronic subdural hematoma. This symptomatic fictional patient is selected for neurosurgical treatment.',
      nuance:'Actual chronic subdural management is individualized, and options differ from acute SDH. This level reuses a generic arcade evacuation sequence; it does not model burr-hole drainage, craniotomy, embolization, recurrence or selection among them.',
      operationNote:'This is the same abstract evacuation mini-game, not a representation of the real chronic subdural procedure. Acute and chronic SDH do not share a universal operative approach.',
      recovery:'Simulation handoff completed after the generic evacuation level. Actual care still requires neurological reassessment and follow-up for recurrence.'
    }
  ]
};
