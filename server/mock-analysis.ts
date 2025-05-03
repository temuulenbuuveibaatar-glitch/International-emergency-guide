import { Request, Response } from "express";

// Function to extract base64 data from dataURL (reused from damage-analysis.ts)
function extractBase64FromDataURL(dataURL: string): string {
  // Check if it's a data URL
  if (!dataURL.startsWith('data:image')) {
    throw new Error('Not a valid image data URL');
  }
  
  // Extract the base64 part after the comma
  const base64Data = dataURL.split(',')[1];
  if (!base64Data) {
    throw new Error('Could not extract base64 data from URL');
  }
  
  return base64Data;
}

// Generate mock X-ray analysis for any injury type
function generateMockXrayAnalysis() {
  // Define multiple body regions with their findings
  const bodyRegions = [
    // Foot/Ankle injuries
    {
      findings: [
        "Fracture of the 5th metatarsal",
        "Calcaneal fracture",
        "Ankle joint dislocation",
        "Stress fracture of the navicular bone"
      ],
      descriptions: [
        "There is a transverse fracture through the base of the 5th metatarsal with minimal displacement. No other fractures or dislocations identified.",
        "Comminuted fracture of the calcaneus with depression of the posterior facet. Böhler's angle is decreased.",
        "Lateral displacement of the talus relative to the tibia. Associated avulsion fracture of the medial malleolus.",
        "Subtle linear sclerosis within the central portion of the navicular bone, with surrounding bone marrow edema."
      ],
      diagnoses: [
        "Jones fracture of the 5th metatarsal",
        "Intra-articular calcaneal fracture, likely from axial loading injury",
        "Ankle joint dislocation with associated fracture, indicating significant ligamentous injury",
        "Navicular stress fracture, commonly seen in athletes with repetitive loading"
      ],
      recommendations: [
        "Non-weight bearing for 6 weeks. Cast or walking boot immobilization. Orthopedic consultation for potential surgical management depending on displacement.",
        "Urgent orthopedic consultation. CT scan recommended for better visualization of fracture fragments and surgical planning.",
        "Immediate orthopedic consultation for reduction and stabilization. MRI recommended to evaluate ligamentous structures and chondral injury.",
        "Non-weight bearing in a short leg cast for 6-8 weeks. Follow-up imaging to monitor healing. Bone stimulator may be considered if healing is delayed."
      ]
    },
    // Wrist/Hand injuries
    {
      findings: [
        "Scaphoid fracture",
        "Distal radius fracture",
        "Bennett's fracture",
        "Boxer's fracture"
      ],
      descriptions: [
        "Non-displaced fracture through the waist of the scaphoid. No other carpal abnormalities identified.",
        "Comminuted, intra-articular fracture of the distal radius with dorsal displacement and angulation. Ulnar styloid appears intact.",
        "Intra-articular fracture at the base of the first metacarpal with subluxation of the carpometacarpal joint.",
        "Fracture of the neck of the 5th metacarpal with volar angulation of approximately 40 degrees."
      ],
      diagnoses: [
        "Acute scaphoid fracture, at risk for avascular necrosis due to tenuous blood supply",
        "Distal radius fracture (Colles fracture) consistent with fall on outstretched hand",
        "Bennett's fracture-dislocation, typically from axial loading to partially flexed thumb",
        "5th metacarpal neck fracture, commonly seen with direct impact to knuckle"
      ],
      recommendations: [
        "Thumb spica cast immobilization for 8-12 weeks. Follow-up radiographs every 2-3 weeks to assess healing. Consider CT scan if healing is questionable.",
        "Orthopedic consultation for possible closed reduction and casting versus surgical intervention depending on displacement and stability.",
        "Orthopedic hand specialist consultation. Often requires surgical fixation to restore joint congruity and prevent post-traumatic arthritis.",
        "Closed reduction if angulation exceeds 30 degrees. Otherwise, buddy taping and functional bracing. Avoid heavy gripping for 4-6 weeks."
      ]
    },
    // Shoulder/Arm injuries
    {
      findings: [
        "Proximal humerus fracture",
        "Clavicle fracture",
        "Acromioclavicular joint separation",
        "Humeral shaft fracture"
      ],
      descriptions: [
        "Comminuted fracture of the proximal humerus involving the surgical neck. Fracture fragments demonstrate moderate displacement.",
        "Midshaft clavicular fracture with complete displacement and approximately 1.5 cm shortening.",
        "Widening of the acromioclavicular joint space with superior displacement of the distal clavicle relative to the acromion. Coracoclavicular distance is increased.",
        "Oblique fracture through the midshaft of the humerus with minimal displacement and angulation."
      ],
      diagnoses: [
        "Displaced proximal humerus fracture, likely from fall onto outstretched arm or direct trauma",
        "Displaced midshaft clavicular fracture, consistent with direct impact or fall onto shoulder",
        "Grade III acromioclavicular separation, indicating complete disruption of both acromioclavicular and coracoclavicular ligaments",
        "Humeral shaft fracture, may be caused by direct trauma or torsional force"
      ],
      recommendations: [
        "Orthopedic consultation. Conservative management with sling immobilization for minimally displaced fractures. Surgical intervention may be necessary for significantly displaced or angulated fractures.",
        "Conservative management with sling or figure-of-eight brace for 4-6 weeks in most cases. Orthopedic referral for significantly displaced fractures or those with neurovascular compromise.",
        "Orthopedic consultation. Grade I-II injuries typically managed conservatively with sling and activity modification. Grade III may require surgical repair in active individuals.",
        "Functional bracing for most closed, minimally displaced fractures. Orthopedic referral for open fractures, those with significant displacement, or associated neurovascular injury."
      ]
    },
    // Spine injuries
    {
      findings: [
        "Compression fracture of L1 vertebra",
        "Cervical spine spondylosis",
        "Thoracic vertebral endplate fracture",
        "Spondylolisthesis at L5-S1"
      ],
      descriptions: [
        "Anterior wedge compression fracture of the L1 vertebral body with approximately 20% loss of vertebral height. No retropulsion of bone fragments into the spinal canal.",
        "Degenerative changes at C5-C6 level with disc space narrowing, osteophyte formation, and facet arthropathy. Mild neural foraminal narrowing bilaterally at this level.",
        "Superior endplate fracture of T8 vertebra with minimal depression. Vertebral body height is otherwise maintained.",
        "Grade 2 anterolisthesis of L5 on S1 with bilateral pars interarticularis defects. Disc space narrowing at this level with mild foraminal stenosis."
      ],
      diagnoses: [
        "Stable compression fracture of L1, likely osteoporotic or traumatic in origin",
        "Cervical spondylosis with degenerative disc disease, consistent with age-related changes and possible neck strain",
        "Thoracic endplate fracture, often related to minor trauma in the setting of osteopenia",
        "Isthmic spondylolisthesis at L5-S1, representing forward slippage of L5 vertebra due to bilateral pars defects"
      ],
      recommendations: [
        "Pain management, bracing for comfort if needed, and gradual mobilization as tolerated. Bone density testing recommended. Neurosurgical consultation for severe pain or neurological symptoms.",
        "Conservative management with physical therapy, anti-inflammatory medications, and activity modification. Surgical consultation for persistent neurological symptoms or significant pain unresponsive to conservative measures.",
        "Short period of rest followed by gradual return to activities. Bracing for comfort if needed. Bone density evaluation recommended.",
        "Physical therapy focusing on core strengthening and stabilization exercises. NSAIDs for pain management. Surgical consultation for progressive slippage or persistent neurological symptoms."
      ]
    }
  ];
  
  const severity = ["Mild", "Moderate", "Severe"];
  
  // Select a random body region
  const regionIndex = Math.floor(Math.random() * bodyRegions.length);
  const region = bodyRegions[regionIndex];
  
  // Select a random finding within that region
  const findingIndex = Math.floor(Math.random() * region.findings.length);
  
  return {
    finding_type: region.findings[findingIndex],
    severity: severity[Math.min(findingIndex, severity.length - 1)],
    description: region.descriptions[findingIndex],
    possible_diagnosis: region.diagnoses[findingIndex],
    recommendation: region.recommendations[findingIndex],
    limitations: "This is a simulated analysis for demonstration purposes only. In a real scenario, proper radiological interpretation by a qualified radiologist is essential."
  };
}

// Generate mock MRI analysis for any body part
function generateMockMRIAnalysis() {
  // Define multiple body regions with their findings
  const bodyRegions = [
    // Brain MRI findings
    {
      region: "Brain",
      findings: [
        "Normal brain MRI",
        "Small vessel ischemic changes",
        "Acute infarct",
        "Multiple sclerosis plaques",
        "Mass lesion"
      ],
      locations: [
        "Not applicable",
        "Periventricular white matter",
        "Left middle cerebral artery territory",
        "Periventricular and subcortical white matter",
        "Right parietal lobe"
      ],
      descriptions: [
        "Normal brain parenchyma without evidence of acute infarction, hemorrhage, or mass effect. Ventricles and sulci are normal in size and configuration.",
        "Scattered foci of T2/FLAIR hyperintensity in the periventricular white matter, consistent with chronic small vessel ischemic changes.",
        "Area of restricted diffusion in the left MCA territory, consistent with acute/subacute infarct. No evidence of hemorrhagic transformation.",
        "Multiple ovoid, periventricular and subcortical white matter lesions with high T2/FLAIR signal. Some show enhancement with contrast.",
        "Heterogeneously enhancing mass in the right parietal lobe with surrounding vasogenic edema and mass effect on the adjacent ventricle."
      ],
      diagnoses: [
        "No acute intracranial abnormality",
        "Chronic small vessel ischemic disease, likely related to hypertension or age-related changes",
        "Acute/subacute ischemic stroke in the left MCA territory",
        "Findings consistent with multiple sclerosis. Clinical correlation recommended.",
        "Intracranial mass, likely primary neoplasm. Differential includes high-grade glioma."
      ],
      recommendations: [
        "No further imaging is necessary at this time.",
        "Clinical correlation with vascular risk factors. Consider carotid ultrasound if not recently performed.",
        "Neurology consultation recommended. Follow-up MRI in 3 months to evaluate for evolution.",
        "Neurology consultation recommended. Consider CSF analysis and evoked potentials to support MS diagnosis.",
        "Urgent neurosurgical consultation recommended. Consider stereotactic biopsy for definitive diagnosis."
      ]
    },
    // Knee MRI findings
    {
      region: "Knee",
      findings: [
        "ACL tear",
        "Medial meniscus tear",
        "MCL sprain",
        "Patellar tendinopathy",
        "Osteochondral defect"
      ],
      locations: [
        "Anterior cruciate ligament",
        "Medial meniscus, posterior horn",
        "Medial collateral ligament",
        "Patellar tendon",
        "Medial femoral condyle"
      ],
      descriptions: [
        "Complete disruption of the anterior cruciate ligament fibers with surrounding edema. The PCL, MCL, and LCL appear intact.",
        "Complex tear of the posterior horn of the medial meniscus extending to the inferior articular surface. Moderate joint effusion present.",
        "Increased signal within the medial collateral ligament with surrounding soft tissue edema. No complete disruption of fibers identified.",
        "Thickening and increased signal within the patellar tendon with adjacent soft tissue edema, most pronounced at the inferior pole of the patella.",
        "Full-thickness cartilage defect measuring approximately 1.0 x 1.5 cm in the weight-bearing portion of the medial femoral condyle with underlying subchondral bone marrow edema."
      ],
      diagnoses: [
        "Complete ACL tear, acute or subacute based on surrounding edema",
        "Complex tear of the posterior horn of medial meniscus",
        "Grade 2 MCL sprain",
        "Patellar tendinopathy (jumper's knee)",
        "Osteochondral lesion of the medial femoral condyle, likely post-traumatic"
      ],
      recommendations: [
        "Orthopedic surgery consultation for evaluation and management. Consider ACL reconstruction based on patient's age, activity level, and clinical instability.",
        "Orthopedic consultation. Management options include observation, physical therapy, or arthroscopic meniscectomy/repair depending on symptoms and clinical findings.",
        "Conservative management with knee brace, rest, ice, and physical therapy. Gradual return to activities as symptoms improve, typically over 4-6 weeks.",
        "Physical therapy focusing on eccentric loading exercises. Activity modification to reduce jumping and running impacts. Orthopedic consultation for persistent symptoms.",
        "Orthopedic consultation for potential surgical management including debridement, microfracture, or osteochondral autograft/allograft depending on lesion size and patient factors."
      ]
    },
    // Spine MRI findings
    {
      region: "Spine",
      findings: [
        "Lumbar disc herniation",
        "Cervical spinal stenosis",
        "Thoracic compression fracture",
        "Spinal cord contusion",
        "Lumbar spondylolisthesis"
      ],
      locations: [
        "L4-L5 intervertebral disc",
        "C5-C6 level",
        "T12 vertebral body",
        "C4 spinal cord level",
        "L5-S1 junction"
      ],
      descriptions: [
        "Right paracentral disc extrusion at L4-L5 level causing severe right lateral recess stenosis and compression of the descending right L5 nerve root.",
        "Severe cervical spinal canal narrowing at C5-C6 due to combination of disc bulge, facet arthropathy, and ligamentum flavum hypertrophy. Cord signal appears normal.",
        "Acute compression fracture of T12 vertebral body with approximately 40% height loss. No retropulsion of fragments into the spinal canal.",
        "Focal area of increased T2 signal within the spinal cord at C4 level without evidence of compression. No hemorrhage or syrinx formation.",
        "Grade 2 anterolisthesis of L5 on S1 with bilateral pars interarticularis defects. Severe bilateral foraminal stenosis at this level with compression of exiting L5 nerve roots."
      ],
      diagnoses: [
        "Right paracentral disc extrusion at L4-L5 with right L5 nerve root compression",
        "Severe cervical spinal stenosis at C5-C6 without myelopathy",
        "Acute compression fracture of T12 vertebra, likely osteoporotic",
        "Spinal cord contusion at C4 level, suggestive of trauma",
        "Grade 2 isthmic spondylolisthesis at L5-S1 with severe foraminal stenosis"
      ],
      recommendations: [
        "Pain management including NSAIDs and physical therapy. Epidural steroid injection may be considered. Neurosurgical consultation for persistent radicular symptoms or progressive neurological deficits.",
        "Neurosurgical consultation for consideration of decompressive surgery, particularly with progressive symptoms or evidence of myelopathy. Physical therapy and NSAIDs for symptom management in the interim.",
        "Pain management and gradual mobilization as tolerated. Bracing for comfort. Bone density testing recommended. Consider kyphoplasty for persistent pain.",
        "Neurosurgical consultation. Spinal precautions and immobilization with cervical collar. High-dose corticosteroids may be considered based on timing and clinical context.",
        "Neurosurgical consultation for consideration of decompression and fusion, particularly with persistent radicular symptoms or neurological deficits. Physical therapy focusing on core stabilization in the interim."
      ]
    },
    // Shoulder MRI findings
    {
      region: "Shoulder",
      findings: [
        "Rotator cuff tear",
        "Labral tear",
        "Glenohumeral joint instability",
        "Subacromial impingement",
        "Biceps tendon pathology"
      ],
      locations: [
        "Supraspinatus tendon",
        "Superior labrum",
        "Anterior-inferior labrum and capsule",
        "Subacromial space",
        "Long head of biceps tendon"
      ],
      descriptions: [
        "Full-thickness tear of the supraspinatus tendon measuring approximately 2.5 cm in anterior-posterior dimension with 1.5 cm of retraction. Moderate muscle atrophy and fatty infiltration present.",
        "Complex tear of the superior labrum extending from anterior to posterior (SLAP tear) with associated paralabral cyst formation.",
        "Avulsion of the anterior-inferior labrum with attached inferior glenohumeral ligament from the glenoid rim (Bankart lesion). Associated Hill-Sachs impaction fracture of the posterolateral humeral head.",
        "Decreased acromiohumeral distance with subacromial spurring and edema within the supraspinatus tendon. Type III (hooked) acromion morphology.",
        "Partial-thickness tear of the long head of biceps tendon with surrounding tenosynovitis. Medial subluxation from the bicipital groove."
      ],
      diagnoses: [
        "Large, full-thickness supraspinatus tendon tear with moderate retraction and muscle degeneration",
        "Type II SLAP tear",
        "Anterior shoulder instability with Bankart and Hill-Sachs lesions, consistent with recurrent dislocations",
        "Subacromial impingement syndrome with tendinopathy",
        "Partial biceps tendon tear with medial subluxation"
      ],
      recommendations: [
        "Orthopedic consultation for surgical consideration. Rotator cuff repair may be recommended based on tear size, degree of retraction, tissue quality, and patient's age and activity demands.",
        "Orthopedic consultation. Management options include physical therapy or arthroscopic repair depending on severity of symptoms and patient's activity level.",
        "Orthopedic consultation for potential surgical stabilization, particularly in young active patients or those with recurrent dislocations.",
        "Initial management with physical therapy, NSAIDs, and possibly subacromial corticosteroid injection. Consider surgical decompression for refractory cases.",
        "Orthopedic consultation. Options include conservative management with physical therapy, tenotomy, or tenodesis depending on patient factors and associated pathology."
      ]
    }
  ];
  
  // Select a random body region
  const regionIndex = Math.floor(Math.random() * bodyRegions.length);
  const region = bodyRegions[regionIndex];
  
  // Select a random finding within that region
  const findingIndex = Math.floor(Math.random() * region.findings.length);
  
  return {
    finding_type: region.findings[findingIndex],
    location: region.locations[findingIndex],
    description: region.descriptions[findingIndex],
    possible_diagnosis: region.diagnoses[findingIndex],
    recommendation: region.recommendations[findingIndex],
    limitations: "This is a simulated analysis for demonstration purposes only. In a real scenario, proper radiological interpretation by a qualified radiologist is essential."
  };
}

// Generate mock medical image analysis for any visible injury or condition
function generateMockMedicalAnalysis() {
  // Define multiple body regions with their findings
  const bodyRegions = [
    // Extremity injuries (hands, feet, limbs)
    {
      region: "Extremities",
      findings: [
        "Fracture",
        "Sprain",
        "Contusion",
        "Joint deformity",
        "Tendon injury"
      ],
      descriptions: [
        "Visible deformity with significant swelling and bruising. The alignment appears abnormal with possible bone displacement.",
        "Significant swelling and bruising around the joint. No obvious deformity, but marked tenderness and limited range of motion are visible.",
        "Extensive bruising and swelling. No obvious deformity noted but significant discoloration is present.",
        "Joint appears subluxed or dislocated with abnormal positioning. Surrounding soft tissue swelling is present.",
        "Visible abnormality in tendon continuity with swelling and ecchymosis. Possible defect in normal tendon contour."
      ],
      diagnoses: [
        "Fracture, likely from direct trauma or fall",
        "Ligament sprain, potentially involving the major stabilizing ligaments",
        "Soft tissue contusion due to direct trauma",
        "Joint dislocation or subluxation requiring prompt reduction",
        "Possible tendon rupture or severe tendinopathy"
      ],
      recommendations: [
        "Immediate medical evaluation. Immobilization and X-ray required for definitive diagnosis. Avoid bearing weight or using the affected limb.",
        "RICE protocol (Rest, Ice, Compression, Elevation). Immobilization with appropriate brace or splint. Physical therapy once acute phase has resolved.",
        "RICE protocol for initial management. Avoid strenuous activities until pain and swelling subside. Gradual return to normal activities.",
        "Emergency medical evaluation for reduction. Do not attempt to reduce the joint yourself. Immobilization after reduction will be necessary.",
        "Immediate orthopedic consultation. Immobilization in appropriate position. Surgical intervention may be necessary for complete tears."
      ],
      severity: ["Moderate", "Severe"]
    },
    // Skin conditions
    {
      region: "Skin",
      findings: [
        "Laceration",
        "Burn",
        "Rash",
        "Infection",
        "Allergic reaction"
      ],
      descriptions: [
        "Linear wound with clean or irregular edges. Surrounding tissue appears normal without significant contamination.",
        "Erythematous skin with blistering and partial-thickness skin loss. Surrounding skin shows hyperemia but no charring.",
        "Erythematous, papular eruption with patchy distribution. No vesicles or pustules noted. Minimal scaling present.",
        "Localized area of erythema, edema, and warmth. Central area appears fluctuant with possible purulent drainage.",
        "Diffuse urticarial eruption with raised, erythematous wheals. Significant edema present in the affected areas."
      ],
      diagnoses: [
        "Simple laceration requiring wound closure",
        "Second-degree (partial thickness) burn",
        "Contact dermatitis, possibly due to exposure to irritant or allergen",
        "Cutaneous abscess or cellulitis",
        "Acute urticaria, likely representing allergic reaction"
      ],
      recommendations: [
        "Wound cleansing with mild soap and water or antiseptic solution. Consider closure with adhesive strips, tissue adhesive, or sutures depending on size and location. Tetanus prophylaxis if indicated.",
        "Cool the area with running water (not ice) for 10-15 minutes. Cover with clean, non-adherent dressing. Medical evaluation recommended for burns larger than 3% body surface area or involving sensitive areas.",
        "Avoid suspected irritants/allergens. Apply cool compresses and consider topical corticosteroids. Oral antihistamines for significant pruritus.",
        "Medical evaluation recommended. Warm compresses may help with discomfort. Antibiotics likely necessary, possibly incision and drainage for abscesses.",
        "Remove suspected allergen. Antihistamines and cool compresses for symptomatic relief. If associated with breathing difficulty, facial swelling, or hypotension, seek emergency care immediately."
      ],
      severity: ["Mild", "Moderate", "Severe"]
    },
    // Facial/head injuries
    {
      region: "Face/Head",
      findings: [
        "Facial laceration",
        "Periorbital contusion",
        "Nasal trauma",
        "Mandibular injury",
        "Scalp hematoma"
      ],
      descriptions: [
        "Linear laceration on facial surface with well-defined edges. Minimal debris visible within the wound.",
        "Significant ecchymosis and edema surrounding the orbital region. No apparent globe injury or visual disturbance reported.",
        "Nasal asymmetry with lateral displacement. Significant edema and ecchymosis of nasal bridge and perinasal region.",
        "Limited jaw excursion with malocclusion. Significant pain with mandibular movement and possible step-off on palpation.",
        "Fluctuant, boggy swelling on the scalp with overlying ecchymosis. No overlying laceration or visible depression."
      ],
      diagnoses: [
        "Facial laceration requiring careful repair for optimal cosmetic outcome",
        "Periorbital contusion ('black eye'), likely from direct trauma",
        "Nasal fracture or significant nasal contusion",
        "Possible mandibular fracture or temporomandibular joint injury",
        "Subgaleal hematoma from blunt trauma to the scalp"
      ],
      recommendations: [
        "Meticulous wound cleansing. Consider plastic surgery consultation for complex facial lacerations, especially those crossing aesthetic boundaries. Wound closure under optimal conditions for best cosmetic result.",
        "Cold compresses for the first 24-48 hours to reduce swelling. Elevation of head when reclining. Ophthalmologic evaluation if vision changes, diplopia, or severe pain develop.",
        "ENT consultation recommended. Ice and analgesia for comfort. Reduction may be necessary for significantly displaced fractures, ideally within 10 days of injury.",
        "Maxillofacial surgery consultation. Soft diet and avoidance of excessive jaw movement. Imaging studies (panoramic radiograph or CT) required for definitive diagnosis.",
        "Apply ice intermittently for comfort. Observe for changes in mental status or progressive swelling. Medical evaluation if symptoms worsen or fail to improve within 2-3 days."
      ],
      severity: ["Moderate", "Severe"]
    },
    // Chest/abdominal conditions
    {
      region: "Torso",
      findings: [
        "Chest wall contusion",
        "Abdominal distension",
        "Flank ecchymosis",
        "Surgical site infection",
        "Hernia"
      ],
      descriptions: [
        "Localized area of ecchymosis and tenderness over the anterior chest wall. No crepitus or obvious deformity.",
        "Generalized abdominal distension with tympany to percussion. Mild diffuse tenderness without rebound or guarding.",
        "Extensive ecchymosis over the flank region extending to the lower back. Area is tender to palpation.",
        "Surgical incision with surrounding erythema, edema, and purulent drainage. Surrounding skin is warm to touch.",
        "Visible bulge in the abdominal wall that increases with standing or Valsalva maneuver. Reducible with gentle pressure."
      ],
      diagnoses: [
        "Chest wall contusion from blunt trauma",
        "Abdominal distension, possibly due to ileus or obstruction",
        "Flank ecchymosis (Grey Turner sign), concerning for retroperitoneal hemorrhage",
        "Surgical site infection, likely superficial but requiring evaluation",
        "Ventral or incisional hernia, containing abdominal contents"
      ],
      recommendations: [
        "Analgesia for comfort. Deep breathing exercises to prevent atelectasis. Medical evaluation if pain is severe or breathing is significantly compromised.",
        "Medical evaluation recommended. Avoid solid foods until evaluated. Maintain hydration with clear liquids if tolerated and no vomiting.",
        "Urgent medical evaluation recommended, particularly if accompanied by abdominal pain, lightheadedness, or history of trauma.",
        "Medical evaluation for possible antibiotic therapy. Gentle cleansing with mild soap and water. Avoid occlusive dressings if drainage is present.",
        "Surgical consultation for definitive management. Avoid heavy lifting and straining activities. Manual reduction (if easily reducible) when lying down."
      ],
      severity: ["Mild", "Moderate", "Severe"]
    }
  ];
  
  // Select a random body region
  const regionIndex = Math.floor(Math.random() * bodyRegions.length);
  const region = bodyRegions[regionIndex];
  
  // Select a random finding within that region
  const findingIndex = Math.floor(Math.random() * region.findings.length);
  
  // Select an appropriate severity
  const severityIndex = Math.floor(Math.random() * region.severity.length);
  
  return {
    finding_type: region.findings[findingIndex],
    severity: region.severity[severityIndex],
    description: region.descriptions[findingIndex],
    possible_diagnosis: region.diagnoses[findingIndex],
    recommendation: region.recommendations[findingIndex],
    limitations: "This is a simulated analysis for demonstration purposes only. In a real scenario, proper medical evaluation by a qualified healthcare professional is essential."
  };
}

// Generate mock damage analysis for any type of injury
function generateMockDamageAnalysis() {
  // Define multiple injury categories
  const injuryCategories = [
    // Bone injuries
    {
      category: "Bone injuries",
      damageTypes: [
        "Closed fracture",
        "Open fracture",
        "Stress fracture",
        "Comminuted fracture",
        "Compression fracture"
      ],
      descriptions: [
        "Visible deformity with significant swelling and ecchymosis. The bone appears to be broken but the skin is intact.",
        "Bone is visible through a break in the skin. Moderate bleeding present with surrounding tissue damage.",
        "Localized swelling and point tenderness without obvious deformity. Pain increases with weight-bearing or stress on the affected area.",
        "Multiple bone fragments visible on imaging or through wound. Significant soft tissue swelling and deformity present.",
        "Vertebral body appears to have collapsed or compressed. Height of the vertebra is reduced compared to adjacent vertebrae."
      ],
      recommendations: [
        "Immobilize the area and seek immediate medical attention. Do not attempt to straighten the limb. Apply ice for pain and swelling control.",
        "Cover the wound with a clean, sterile dressing. Control bleeding with gentle pressure. Seek emergency medical care immediately. Do not attempt to push protruding bone back under the skin.",
        "Rest from aggravating activities. Ice the affected area 15-20 minutes several times daily. Seek medical evaluation for proper diagnosis and treatment plan.",
        "Emergency medical evaluation required. Immobilize the area in the position found. Surgical intervention is often necessary for comminuted fractures.",
        "Minimize movement and seek immediate medical attention. Do not attempt to bear weight if in a weight-bearing area. Spinal precautions may be necessary."
      ],
      severity: ["Moderate", "Severe"]
    },
    // Joint/ligament injuries
    {
      category: "Joint/ligament injuries",
      damageTypes: [
        "Joint dislocation",
        "Ligament sprain",
        "Ligament tear",
        "Joint subluxation",
        "Meniscus tear"
      ],
      descriptions: [
        "Joint appears completely out of normal anatomical position. Significant deformity, pain, and inability to move the joint.",
        "Significant swelling and bruising around the joint. Pain with movement but no obvious deformity. Some instability possible.",
        "Complete disruption of ligament fibers with joint instability. Significant swelling and ecchymosis surrounding the joint.",
        "Joint temporarily moved out of proper alignment but has returned to place. Residual pain, swelling, and some instability present.",
        "Pain and swelling within knee joint, especially with rotational movements. Mechanical symptoms such as catching or locking may be present."
      ],
      recommendations: [
        "Do not attempt to relocate the joint yourself. Immobilize in the position found and seek emergency medical attention immediately. Apply ice for pain control.",
        "Follow RICE protocol: Rest, Ice, Compression with an elastic bandage, Elevation above heart level. Medical evaluation recommended for proper diagnosis and grading.",
        "Immediate medical evaluation required. Immobilize the joint and avoid weight-bearing or stress on the affected area. Surgical repair may be necessary.",
        "Protect the joint from further injury. Apply ice and gentle compression. Medical evaluation recommended to assess stability and determine appropriate treatment.",
        "Avoid deep squatting, pivoting, and high-impact activities. Apply ice for swelling. Orthopedic evaluation recommended for proper diagnosis and treatment options."
      ],
      severity: ["Moderate", "Severe"]
    },
    // Soft tissue injuries
    {
      category: "Soft tissue injuries",
      damageTypes: [
        "Muscle strain",
        "Muscle contusion",
        "Tendon rupture",
        "Laceration",
        "Crush injury"
      ],
      descriptions: [
        "Localized pain and tenderness in the affected muscle. Some swelling present with pain that increases with active movement or stretch.",
        "Direct impact injury to muscle with significant bruising and swelling. Pain with movement and palpation of the affected area.",
        "Gap palpable in the normal tendon course. Weakness or inability to perform the action of the affected tendon. Significant swelling present.",
        "Linear or irregular wound with variable depth. Edges may be clean or jagged. Surrounding tissue appears normal or minimally damaged.",
        "Compressed soft tissue with significant swelling, discoloration, and potential skin necrosis. Decreased sensation may be present in the affected area."
      ],
      recommendations: [
        "Rest from activities that cause pain. Ice the area for 15-20 minutes several times daily. Gentle stretching once acute pain subsides. Seek medical attention for severe strains.",
        "Apply ice wrapped in a cloth for 15-20 minutes every 2-3 hours. Elevate the injured area when seated or lying down. Gentle, active range of motion as tolerated.",
        "Immediate medical evaluation required. Immobilize the affected area and elevate if possible. Surgical repair is often necessary, especially for major tendons.",
        "Control bleeding with direct pressure using a clean cloth. Clean the wound gently with mild soap and water if superficial. Seek medical attention for deep lacerations or wounds with significant bleeding.",
        "Immediate medical evaluation required. Elevate the injured area above heart level. Do not apply ice directly to severely crushed tissue. Monitor for signs of compartment syndrome (increasing pain, pallor, pulselessness, paresthesia, paralysis)."
      ],
      severity: ["Mild", "Moderate", "Severe"]
    },
    // Burns
    {
      category: "Burns",
      damageTypes: [
        "First-degree burn",
        "Second-degree burn",
        "Third-degree burn",
        "Chemical burn",
        "Electrical burn"
      ],
      descriptions: [
        "Redness and pain of the superficial skin layer. No blistering present. Skin blanches with pressure.",
        "Partial-thickness burn with blistering, significant pain, and redness. Skin is moist and blanches with pressure.",
        "Full-thickness burn involving all skin layers. Area may appear white, charred, or leathery. Reduced or absent pain sensation in the burned area due to nerve damage.",
        "Evidence of chemical exposure with skin damage pattern consistent with liquid or powder contact. Surrounding area may show signs of chemical residue.",
        "Entry and/or exit wounds may be present. Surrounding tissue may show minimal external damage despite significant internal injury potential."
      ],
      recommendations: [
        "Cool the area with room temperature water for 10-15 minutes. Do not use ice. Once cooled, moisturizer or aloe vera gel may provide comfort. Over-the-counter pain relievers if needed.",
        "Cool the area with room temperature water for 15-20 minutes. Do not break blisters. Cover with a clean, non-adherent dressing. Seek medical evaluation for burns larger than 3% body surface area or on sensitive areas.",
        "Medical emergency requiring immediate attention. Do not attempt to remove adherent clothing. Cover with a clean, dry cloth or sterile bandage. Do not apply creams, ointments, or home remedies.",
        "Remove contaminated clothing. Brush off dry chemicals before flushing with water. Flush the area with large amounts of running water for at least 20 minutes. Seek emergency medical attention.",
        "Ensure the scene is safe. Do not touch the person if they may still be in contact with the electrical source. Seek emergency medical care immediately as internal damage may be significant despite minimal external signs."
      ],
      severity: ["Mild", "Moderate", "Severe"]
    }
  ];
  
  // Select a random category
  const categoryIndex = Math.floor(Math.random() * injuryCategories.length);
  const category = injuryCategories[categoryIndex];
  
  // Select a random injury type within that category
  const injuryIndex = Math.floor(Math.random() * category.damageTypes.length);
  
  // Select an appropriate severity
  const severityIndex = Math.floor(Math.random() * category.severity.length);
  
  return {
    damage_type: category.damageTypes[injuryIndex],
    severity: category.severity[severityIndex],
    description: category.descriptions[injuryIndex],
    recommendation: category.recommendations[injuryIndex]
  };
}

// Main analysis function for X-rays
export async function analyzeMockXray(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Extract base64 from data URL (not really needed for mock but keeping for consistency)
    try {
      extractBase64FromDataURL(image);
    } catch (error) {
      console.error('Error extracting base64 from image data:', error);
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock analysis
    const result = generateMockXrayAnalysis();
    
    return res.json(result);
  } catch (error) {
    console.error('Mock X-ray Analysis error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during image analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Main analysis function for MRIs
export async function analyzeMockMRI(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Extract base64 from data URL (not really needed for mock but keeping for consistency)
    try {
      extractBase64FromDataURL(image);
    } catch (error) {
      console.error('Error extracting base64 from image data:', error);
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock analysis
    const result = generateMockMRIAnalysis();
    
    return res.json(result);
  } catch (error) {
    console.error('Mock MRI Analysis error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during image analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Main analysis function for medical images
export async function analyzeMockMedical(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Extract base64 from data URL (not really needed for mock but keeping for consistency)
    try {
      extractBase64FromDataURL(image);
    } catch (error) {
      console.error('Error extracting base64 from image data:', error);
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock analysis
    const result = generateMockMedicalAnalysis();
    
    return res.json(result);
  } catch (error) {
    console.error('Mock Medical Analysis error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during image analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Main analysis function for damage assessment
export async function analyzeMockDamage(req: Request, res: Response) {
  try {
    const { image } = req.body;
    
    if (!image) {
      return res.status(400).json({ error: 'No image provided' });
    }
    
    // Extract base64 from data URL (not really needed for mock but keeping for consistency)
    try {
      extractBase64FromDataURL(image);
    } catch (error) {
      console.error('Error extracting base64 from image data:', error);
      return res.status(400).json({ error: 'Invalid image format' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate mock analysis
    const result = generateMockDamageAnalysis();
    
    return res.json(result);
  } catch (error) {
    console.error('Mock Damage Analysis error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during image analysis',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}

// Function for medical chat
export async function mockMedicalChat(req: Request, res: Response) {
  try {
    const { message } = req.body;
    
    if (!message) {
      return res.status(400).json({ error: 'No message provided' });
    }
    
    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Generate mock responses based on keywords in the message
    let response = "I'm a medical AI assistant. How can I help you today?";
    
    const lowerMessage = message.toLowerCase();
    
    // Foot-specific responses
    if (lowerMessage.includes('foot') || lowerMessage.includes('ankle') || lowerMessage.includes('toe')) {
      if (lowerMessage.includes('break') || lowerMessage.includes('broken') || lowerMessage.includes('fracture')) {
        response = "Foot fractures require prompt medical attention. Signs include pain, swelling, bruising, difficulty walking, and visible deformity. Keep weight off the foot, apply ice, elevate it, and seek medical care for proper diagnosis and treatment. X-rays are typically needed to confirm a fracture.";
      } else if (lowerMessage.includes('sprain') || lowerMessage.includes('twist')) {
        response = "Ankle sprains involve stretching or tearing of ligaments. Follow the RICE protocol: Rest (avoid weight-bearing), Ice (15-20 minutes several times daily), Compression (elastic bandage), and Elevation above heart level. See a healthcare provider for moderate to severe sprains, especially if you cannot bear weight on the affected foot.";
      } else if (lowerMessage.includes('swell') || lowerMessage.includes('swelling')) {
        response = "Foot swelling can result from injury, overuse, or medical conditions. For injury-related swelling, rest the foot, apply ice, and elevate it above heart level. If swelling is severe, persistent, or accompanied by significant pain or difficulty walking, seek medical evaluation to determine the underlying cause.";
      } else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt') || lowerMessage.includes('ache')) {
        response = "Foot pain can stem from various causes including injuries, overuse, improper footwear, or underlying conditions. Rest the foot, apply ice for acute pain, and wear supportive footwear. If pain is severe, persistent, or affects your ability to walk, consult a healthcare provider for proper diagnosis and treatment.";
      } else {
        response = "Foot health is important for overall mobility. Proper footwear with good support, regular stretching, maintaining a healthy weight, and periodic rest can help prevent foot problems. If you experience persistent foot pain, swelling, or changes in appearance, consult with a healthcare provider for evaluation.";
      }
    }
    // General medical responses
    else if (lowerMessage.includes('pain') || lowerMessage.includes('hurt')) {
      response = "Pain can have many causes. It's important to note the location, intensity, duration, and any factors that make it better or worse. If the pain is severe or persistent, please consult a healthcare professional.";
    } else if (lowerMessage.includes('fever') || lowerMessage.includes('temperature')) {
      response = "Fever is often a sign that your body is fighting an infection. Rest, stay hydrated, and consider over-the-counter fever reducers if appropriate. If the fever is high (over 103°F/39.4°C), persistent, or accompanied by severe symptoms, seek medical attention.";
    } else if (lowerMessage.includes('headache')) {
      response = "Headaches can be caused by stress, dehydration, eye strain, or more serious conditions. Ensure you're hydrated, rested, and consider over-the-counter pain relievers if needed. If headaches are severe, sudden, or accompanied by other symptoms like vision changes or neck stiffness, seek immediate medical attention.";
    } else if (lowerMessage.includes('cough') || lowerMessage.includes('cold') || lowerMessage.includes('flu')) {
      response = "Rest, stay hydrated, and consider over-the-counter medications for symptom relief. If symptoms are severe, persistent, or accompanied by high fever or difficulty breathing, consult a healthcare professional.";
    } else if (lowerMessage.includes('blood pressure') || lowerMessage.includes('hypertension')) {
      response = "Maintaining healthy blood pressure is important for heart and vascular health. Regular exercise, a balanced diet low in sodium, maintaining a healthy weight, limiting alcohol, and not smoking can help manage blood pressure. Regular monitoring and medication (if prescribed) are also important.";
    } else if (lowerMessage.includes('diabetes') || lowerMessage.includes('blood sugar')) {
      response = "Managing diabetes involves monitoring blood sugar, taking medications as prescribed, maintaining a balanced diet, regular physical activity, and attending regular check-ups. It's important to recognize and promptly address any symptoms of high or low blood sugar.";
    } else if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      response = "If you're experiencing a medical emergency, please call emergency services (911 in the US) immediately rather than seeking advice here. For symptoms like chest pain, difficulty breathing, severe bleeding, or signs of stroke, immediate medical attention is critical.";
    } else if (lowerMessage.includes('thank')) {
      response = "You're welcome! I'm happy to help. If you have any other health-related questions, feel free to ask.";
    }
    
    return res.json({ response });
  } catch (error) {
    console.error('Mock Chat error:', error);
    return res.status(500).json({ 
      error: 'An error occurred during chat',
      message: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}