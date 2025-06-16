import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "wouter";
import { emergencyProtocols } from "../data/protocols";
import MultimediaButton from "../components/MultimediaButton";
import { 
  AlertTriangle, 
  ArrowLeft, 
  Bookmark, 
  Printer, 
  Share2, 
  Info,
  BookOpen
} from "lucide-react";

interface ProtocolStep {
  title: string;
  description: string;
  important?: boolean;
  imageUrl?: string;
  videoUrl?: string;
}

interface Protocol {
  id: string;
  title: string;
  description: string;
  steps: ProtocolStep[];
  warnings?: string[];
  notes?: string[];
  demoVideo?: string;
  demoImages?: string[];
}

const getProtocolById = (id: string): Protocol | null => {
  const basicProtocol = emergencyProtocols.find(p => p.id === id);
  if (!basicProtocol) return null;

  const protocolSteps: Record<string, ProtocolStep[]> = {
    "cpr-2025": [
      {
        title: "Check for Responsiveness and Breathing",
        description: "Tap the person's shoulders firmly and shout 'Are you okay?' Check for normal breathing by looking for chest rise and fall for no more than 10 seconds. If there's no response and the person isn't breathing normally or only gasping, begin CPR immediately. Do not check for a pulse as a layperson - focus on responsiveness and breathing only.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=OtKvQzpP-Dk",
        imageUrl: "/images/cpr-responsiveness-check.jpg"
      },
      {
        title: "Call 911 and Get AED",
        description: "Call 911 immediately or designate someone specific to do it ('You in the red shirt, call 911'). Request an AED if available. If alone with a phone, put it on speaker. Don't leave the person unless absolutely necessary to get help. Provide the dispatcher with your exact location, the person's condition, and follow their instructions.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=Ko7e22yV8Vg",
        imageUrl: "/images/cpr-call-911.jpg"
      },
      {
        title: "Position Your Hands Correctly",
        description: "Kneel beside the person's chest. Place the heel of one hand on the center of the chest between the nipples (lower half of breastbone). Place your other hand on top, interlacing your fingers. Keep your arms straight and shoulders directly over your hands. Lift your fingers up so only the heel of your hand touches the chest.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=TJGOKhQKZ9M",
        imageUrl: "/images/cpr-hand-position.jpg"
      },
      {
        title: "Begin High-Quality Chest Compressions",
        description: "Push hard and fast at least 2 inches deep (but no more than 2.4 inches). Allow complete chest recoil between compressions - don't lean on the chest. Compress at 100-120 times per minute. Count out loud: '1 and 2 and 3...' Minimize interruptions - compressions should be continuous.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=sQzTtRAjGd8",
        imageUrl: "/images/cpr-compressions.jpg"
      },
      {
        title: "Add Rescue Breaths (If Trained)",
        description: "If trained in CPR: After 30 compressions, tilt head back, lift chin, pinch nose closed, and give 2 breaths (each 1 second long). Watch for chest rise with each breath. If untrained, provide continuous chest compressions without rescue breaths (hands-only CPR).",
        important: false,
        videoUrl: "https://www.youtube.com/watch?v=B2qhvZJJVjU",
        imageUrl: "/images/cpr-rescue-breaths.jpg"
      },
      {
        title: "Continue Until Help Arrives or AED Becomes Available",
        description: "Don't stop compressions until emergency services arrive, the person starts breathing normally, or you become too exhausted to continue. Switch with another rescuer every 2 minutes if possible to maintain quality. If an AED arrives, follow its voice prompts immediately.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=3Pz0aLRaOlM",
        imageUrl: "/images/cpr-continuous.jpg"
      }
    ],
    "choking-2025": [
      {
        title: "Assess the Choking Situation",
        description: "Look for the universal choking sign (hands clutching the throat). Ask 'Are you choking?' If the person can cough forcefully, speak, or breathe, encourage continued coughing - this is a mild airway obstruction. If they cannot breathe, cough, speak, or make sounds, this is severe choking requiring immediate intervention. Call 911 or have someone else do it.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=7DhKqhOgkQ4",
        imageUrl: "/images/choking-assessment.jpg"
      },
      {
        title: "Position for Back Blows",
        description: "Stand to the side and slightly behind the person. For adults: support their chest with one hand and lean them forward at the waist so the object will fall out of the mouth rather than further down the throat. For children: support them over your forearm with their head lower than their chest.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=Os2vHJMXjWo",
        imageUrl: "/images/choking-back-blows-position.jpg"
      },
      {
        title: "Give 5 Sharp Back Blows",
        description: "Using the heel of your hand, give up to 5 sharp back blows between the shoulder blades. Each blow should be separate and distinct, delivered with the intent to dislodge the object. Check the mouth after each blow to see if the object has been expelled. Remove any visible objects with your fingers using a hooking motion.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=qfbPEDILbYk",
        imageUrl: "/images/choking-back-blows.jpg"
      },
      {
        title: "Perform 5 Abdominal Thrusts (Heimlich Maneuver)",
        description: "If back blows don't work, stand behind the person. Place your fist just above the navel and below the rib cage. Grasp your fist with your other hand and give up to 5 quick upward and inward thrusts. Each thrust should be separate and distinct. For pregnant women or obese individuals, use chest thrusts instead.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=lvbJJqB3RHs",
        imageUrl: "/images/choking-abdominal-thrusts.jpg"
      },
      {
        title: "Continue Alternating Techniques",
        description: "Continue alternating 5 back blows and 5 abdominal thrusts until the object is expelled, the person can breathe/speak, or they become unconscious. Stay with the person and encourage them to keep trying to cough between interventions. Don't give up - continue until help arrives.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=FEr9jjZ6fi8",
        imageUrl: "/images/choking-alternating-cycle.jpg"
      },
      {
        title: "If Person Becomes Unconscious",
        description: "Gently lower them to the ground and immediately call 911 if not already done. Begin CPR starting with chest compressions. Before giving rescue breaths, open the mouth and look for the object. If you see it, remove it with your fingers using a hooking motion. Don't do blind finger sweeps. Continue CPR until help arrives.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=mAzMJdoVnFQ",
        imageUrl: "/images/choking-unconscious-cpr.jpg"
      }
    ],
    "stroke-2025": [
      {
        title: "Balance - Check for Loss of Coordination",
        description: "Ask about sudden loss of balance, dizziness, or coordination problems. Look for sudden trouble walking, loss of coordination, or unexplained falls. If safe, ask the person to walk a few steps and observe for unsteadiness, veering to one side, or inability to walk straight. This may be the only sign of a posterior circulation stroke.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=KFj0dOGSRpI",
        imageUrl: "/images/stroke-balance-test.jpg"
      },
      {
        title: "Eyes - Check for Vision Loss",
        description: "Ask about sudden vision loss, double vision, or visual field cuts. Have them track your finger with their eyes in all directions. Ask if they can see your entire face or if parts are missing. Test peripheral vision by having them look at your nose while you wiggle fingers in their peripheral vision. Sudden vision changes can indicate stroke.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=V4Op2MDrJ0I",
        imageUrl: "/images/stroke-vision-test.jpg"
      },
      {
        title: "Face - Check for Facial Drooping",
        description: "Ask the person to smile broadly, showing their teeth. Look for an uneven or lopsided smile, with one side of the face drooping or not moving. Check if both sides of the face move equally. Ask them to puff out their cheeks or raise their eyebrows. Facial drooping is one of the most recognizable signs of stroke.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=RQAhL7-TuWg",
        imageUrl: "/images/stroke-face-test.jpg"
      },
      {
        title: "Arms - Check for Weakness",
        description: "Ask the person to raise both arms above their head for 10 seconds with palms up and eyes closed. Look for one arm drifting downward, inability to lift one arm, or one arm falling faster than the other. You can also test grip strength by having them squeeze your fingers with both hands simultaneously. Arm weakness indicates motor function impairment.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=j3rNsJzB5BI",
        imageUrl: "/images/stroke-arm-test.jpg"
      },
      {
        title: "Speech - Check for Speech Problems",
        description: "Ask them to repeat a simple phrase like 'The early bird catches the worm' or 'The sky is blue in Cincinnati'. Listen for slurred speech, strange words, wrong words, or inability to understand or speak. Also test comprehension by asking them to follow simple commands like 'show me two fingers' or 'stick out your tongue'.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=fFnOfk9wDtE",
        imageUrl: "/images/stroke-speech-test.jpg"
      },
      {
        title: "Time - Call 911 Immediately and Note Time",
        description: "If ANY of the above signs are present, note the exact time symptoms started (or when last seen normal) and call 911 immediately. Tell the dispatcher 'I think someone is having a stroke' and provide the time of symptom onset. Time is brain - every minute counts. The person may be eligible for clot-busting medication if treated within 3-4.5 hours.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=NDVsSwgyMHM",
        imageUrl: "/images/stroke-call-911.jpg"
      }
    ],
    "bleeding-control-2025": [
      {
        title: "Ensure Scene Safety and Personal Protection",
        description: "Before approaching, assess the scene for ongoing dangers such as traffic, violence, fire, or hazardous materials. Wear disposable gloves, use eye protection if available, or create a barrier between you and the blood using plastic bags, cloth, or clothing. Your safety comes first - you cannot help if you become injured or infected.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=ufUQ_kF_nUs",
        imageUrl: "/images/bleeding-scene-safety.jpg"
      },
      {
        title: "Call 911 Immediately",
        description: "Call emergency services immediately for severe bleeding. Tell them 'severe bleeding/hemorrhage' and provide exact location. For life-threatening bleeding, also request blood products and trauma team activation. If others are present, designate someone specific to call while you provide care.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=hGJgaJgTHi0",
        imageUrl: "/images/bleeding-call-911.jpg"
      },
      {
        title: "Apply Direct Pressure",
        description: "Place clean cloth, gauze, or even clothing directly on the wound. Use both hands if needed and press firmly and continuously with the heel of your hands. Don't peek or lift to check - maintain constant pressure. Don't remove blood-soaked materials; instead, add more clean materials on top and continue pressing.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=3BPZPBl4YUE",
        imageUrl: "/images/bleeding-direct-pressure.jpg"
      },
      {
        title: "Elevate the Injured Area",
        description: "If possible and no fracture is suspected, raise the bleeding area above the level of the heart to reduce blood flow. This works best for arm and leg injuries. Support the injured area while maintaining direct pressure. Don't elevate if you suspect spinal, neck, or bone injuries.",
        important: false,
        videoUrl: "https://www.youtube.com/watch?v=vLkj4D_sKyc",
        imageUrl: "/images/bleeding-elevation.jpg"
      },
      {
        title: "Apply Pressure to Arterial Pressure Points",
        description: "If direct pressure and elevation don't control bleeding, apply pressure to arterial pressure points between the wound and the heart. For arm wounds: press the brachial artery against the arm bone. For leg wounds: press the femoral artery in the groin. Maintain direct pressure while applying pressure point control.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=ljqRiWfCLEE",
        imageUrl: "/images/bleeding-pressure-points.jpg"
      },
      {
        title: "Apply Tourniquet for Life-Threatening Limb Bleeding",
        description: "For severe limb bleeding that won't stop with direct pressure, apply a tourniquet 2-3 inches above the wound (closer to the heart). Tighten until bleeding stops completely. Write the time of application on the tourniquet or victim's forehead. Don't loosen once applied - let medical professionals remove it. Commercial tourniquets are preferred over improvised ones.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=5LxMWRfEajc",
        imageUrl: "/images/bleeding-tourniquet.jpg"
      }
    ],
    "burns-2025": [
      {
        title: "Ensure Safety and Remove from Heat Source",
        description: "Safely remove the person from the heat source - fire, hot surfaces, chemicals, or electricity. For electrical burns, ensure power is completely turned off before touching the victim. For chemical burns, remove contaminated clothing carefully using gloves. Stop the burning process immediately.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=t6kUOPXzl34",
        imageUrl: "/images/burns-safety-removal.jpg"
      },
      {
        title: "Cool the Burn Immediately",
        description: "For thermal burns, immediately cool with clean, cool (not ice-cold) running water for 10-20 minutes. This stops the burning process and reduces pain. Remove jewelry, watches, and tight clothing before swelling occurs. For chemical burns, flush with water for at least 20 minutes.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=sCm1TadmKC4",
        imageUrl: "/images/burns-cooling-water.jpg"
      },
      {
        title: "Assess Burn Severity and Call 911",
        description: "First-degree: red, painful, no blisters. Second-degree: blistered, very painful, may appear white/red. Third-degree: white/charred, may be painless due to nerve damage. Call 911 for: burns larger than 3 inches, any third-degree burns, burns on face/hands/feet/genitals, electrical or chemical burns.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=rG-qozYcOdY",
        imageUrl: "/images/burns-severity-assessment.jpg"
      },
      {
        title: "Cover and Protect the Burn",
        description: "Use sterile gauze or clean, dry cloth to loosely cover the burn. Don't use cotton balls, adhesive bandages directly on burns, or any home remedies like butter, oils, or ice. Keep the covering loose to avoid pressure on damaged tissue.",
        important: false,
        videoUrl: "https://www.youtube.com/watch?v=5RktWaLKDqU",
        imageUrl: "/images/burns-covering-bandage.jpg"
      },
      {
        title: "Monitor for Shock and Complications",
        description: "For severe burns, treat for shock by keeping the person warm (but not the burned area), elevate legs if no spinal injury suspected, and monitor breathing. Watch for signs of infection. Be prepared to perform CPR if breathing stops. Get medical attention even for seemingly minor burns.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=n7qs2dYWaUc",
        imageUrl: "/images/burns-shock-monitoring.jpg"
      }
    ],
    "heart-attack-2025": [
      {
        title: "Recognize Heart Attack Warning Signs",
        description: "Classic signs: chest pain/pressure/squeezing, shortness of breath, nausea, sweating, pain radiating to left arm, jaw, neck, or back. Women and diabetics may have atypical symptoms: fatigue, indigestion, back pain, jaw pain without chest pain. Don't wait for 'classic' symptoms - trust your instincts.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=d61aorw05_g",
        imageUrl: "/images/heart-attack-symptoms.jpg"
      },
      {
        title: "Call 911 Immediately - Don't Drive",
        description: "Call emergency services immediately - don't drive to hospital. Tell them 'possible heart attack' and provide exact location. Request ALS (Advanced Life Support) and notify them to activate cardiac catheterization team. EMS can start treatment en route and bypass emergency room for direct cardiac care.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=gPCDcFGgI9s",
        imageUrl: "/images/heart-attack-call-911.jpg"
      },
      {
        title: "Give Aspirin if Safe",
        description: "Give 325mg aspirin (4 baby aspirin or 1 regular) to chew if person is conscious, not allergic to aspirin, and has no bleeding disorders or stomach ulcers. Chewing is faster than swallowing. Don't delay 911 call to find aspirin. Aspirin helps prevent further clot formation.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=zT2zfL1xFzg",
        imageUrl: "/images/heart-attack-aspirin.jpg"
      },
      {
        title: "Position for Comfort and Breathing",
        description: "Help person sit upright in a chair or half-sitting against pillows - this reduces heart workload. Loosen tight clothing around neck and chest. Keep person calm and still. Don't let them walk around or exert themselves. Reassure them that help is coming.",
        important: false,
        videoUrl: "https://www.youtube.com/watch?v=wHdhjVRzGFE",
        imageUrl: "/images/heart-attack-positioning.jpg"
      },
      {
        title: "Monitor Closely and Prepare for Cardiac Arrest",
        description: "Monitor breathing and consciousness continuously. Be prepared to start CPR immediately if person becomes unconscious or stops breathing normally. Heart attack can lead to cardiac arrest. Stay with the person and provide reassurance while waiting for EMS.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=JoCIAPT_2nU",
        imageUrl: "/images/heart-attack-monitoring.jpg"
      }
    ],
    "anaphylaxis-2025": [
      {
        title: "Recognize Severe Allergic Reaction Signs",
        description: "Life-threatening signs: difficulty breathing, wheezing, swelling of face/lips/tongue/throat, rapid weak pulse, widespread skin rash/hives, severe nausea/vomiting, dizziness, loss of consciousness. This can progress rapidly from mild to severe within minutes. Any two body systems affected = anaphylaxis.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=dShvmQSrfrY",
        imageUrl: "/images/anaphylaxis-symptoms.jpg"
      },
      {
        title: "Call 911 Immediately",
        description: "Call emergency services immediately - tell them 'anaphylaxis' or 'severe allergic reaction'. Request epinephrine, advanced life support, and fast transport. Even if symptoms improve, hospital evaluation is essential as biphasic reactions can occur hours later.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=tR_I6ZK1Brc",
        imageUrl: "/images/anaphylaxis-call-911.jpg"
      },
      {
        title: "Use Epinephrine Auto-Injector Immediately",
        description: "If epinephrine auto-injector (EpiPen, Auvi-Q) is available, use immediately - don't hesitate. Remove safety cap, place against outer thigh (through clothing if needed), press firmly until you hear a click, hold for 10 seconds. Massage injection site for 10 seconds after injection.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=J9pNtEj5Odw",
        imageUrl: "/images/anaphylaxis-epipen-use.jpg"
      },
      {
        title: "Remove Trigger Source if Possible",
        description: "If you can identify the allergen (food, medication, insect stinger, etc.), remove or help person avoid continued exposure. For bee stings, scrape out stinger with credit card - don't squeeze. Remove contaminated clothing if chemical exposure.",
        important: false,
        videoUrl: "https://www.youtube.com/watch?v=Km4uB5Egov8",
        imageUrl: "/images/anaphylaxis-remove-trigger.jpg"
      },
      {
        title: "Position Based on Symptoms",
        description: "If breathing is difficult: help them sit upright or in position of comfort. If blood pressure is low/dizzy: have them lie down with legs elevated. If vomiting: turn on side to prevent choking. Never give anything by mouth during anaphylaxis.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=eFhN8_Tg8tU",
        imageUrl: "/images/anaphylaxis-positioning.jpg"
      },
      {
        title: "Prepare for Second Epinephrine Dose",
        description: "Monitor closely - a second epinephrine injection may be needed in 5-15 minutes if symptoms don't improve or worsen. Most people with severe allergies carry two injectors. Be prepared to perform CPR if person becomes unconscious. Stay with them until EMS arrives.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=5KKLKXCzYns",
        imageUrl: "/images/anaphylaxis-second-dose.jpg"
      }
    ],
    "respiratory-distress-2025": [
      {
        title: "Assess Severity of Breathing Difficulty",
        description: "Look for severe respiratory distress signs: inability to speak in full sentences, tripod positioning, use of accessory neck/chest muscles, blue lips/fingernails (cyanosis), extreme anxiety or agitation, or altered mental status. Mild distress allows normal conversation; severe distress is life-threatening.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=VmBR0VdvE8s",
        imageUrl: "/images/respiratory-assessment.jpg"
      },
      {
        title: "Call 911 for Severe Respiratory Distress",
        description: "Call emergency services immediately if: severe distress, unconsciousness, blue discoloration, or inability to speak. Request advanced airway management and respiratory therapist. Tell dispatcher specific breathing problem (asthma, COPD, etc.) if known.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=r8QmJaWRdow",
        imageUrl: "/images/respiratory-call-911.jpg"
      },
      {
        title: "Position for Optimal Breathing",
        description: "Help person sit upright in high Fowler's position or tripod position (sitting up, leaning forward on hands/table). This maximizes lung expansion and reduces work of breathing. Never force them to lie down if they're more comfortable sitting up.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=NKOYQdNv5U8",
        imageUrl: "/images/respiratory-positioning.jpg"
      },
      {
        title: "Assist with Rescue Medications",
        description: "Help person use their rescue inhaler (albuterol/bronchodilator) if available - shake well, use spacer if available, coach proper technique. For severe asthma, may use every 20 minutes. Remove triggers like allergens, smoke, or irritants from environment.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=BG2YO5hi-Qs",
        imageUrl: "/images/respiratory-inhaler-use.jpg"
      },
      {
        title: "Monitor and Provide Emotional Support",
        description: "Stay calm and reassure the person - anxiety worsens breathing difficulty. Coach slow, pursed-lip breathing if conscious and cooperative. Monitor for worsening symptoms. Be prepared to perform rescue breathing or CPR if respiratory arrest occurs.",
        important: true,
        videoUrl: "https://www.youtube.com/watch?v=1Dq88eOoW0s",
        imageUrl: "/images/respiratory-monitoring.jpg"
      }
    ],
    "trauma-response-2025": [
      {
        title: "Ensure Scene Safety",
        description: "Before approaching, assess the scene for ongoing dangers such as traffic, fire, electrical hazards, or unstable structures. Ensure your safety first.",
        important: true
      },
      {
        title: "Check for Responsiveness",
        description: "Approach the victim and check for consciousness. Tap shoulders and shout. If unconscious, assume spinal injury and avoid moving the head/neck.",
        important: true
      },
      {
        title: "Call for Emergency Services",
        description: "Call 911 immediately. Request advanced life support and specify the nature of trauma. Request helicopter transport if available and appropriate.",
        important: true
      },
      {
        title: "Control Life-Threatening Bleeding",
        description: "Apply direct pressure to bleeding wounds using clean cloth or bandages. For severe arterial bleeding, apply pressure to pressure points or use tourniquets if trained.",
        important: true
      },
      {
        title: "Maintain Airway with C-Spine Protection",
        description: "If airway is compromised, use jaw-thrust maneuver instead of head-tilt chin-lift to avoid spinal injury. Clear visible obstructions carefully.",
        important: true
      },
      {
        title: "Monitor and Treat for Shock",
        description: "Keep victim warm, elevate legs if no spinal injury suspected, monitor pulse and breathing. Be prepared to perform CPR if needed.",
        important: true
      }
    ],
    "seizure-management-2025": [
      {
        title: "Ensure Person's Safety",
        description: "Move dangerous objects away from the person. Don't try to restrain them or put anything in their mouth. Cushion their head if possible.",
        important: true
      },
      {
        title: "Time the Seizure",
        description: "Note the time the seizure starts. Call 911 if seizure lasts longer than 5 minutes, person is injured, or has no known seizure disorder.",
        important: true
      },
      {
        title: "Position After Seizure",
        description: "After seizure stops, gently turn person on their side to help with breathing and prevent choking on saliva.",
        important: true
      },
      {
        title: "Monitor Recovery",
        description: "Stay with person as they recover. They may be confused or sleepy. Provide reassurance and don't give food or water until fully alert.",
        important: true
      },
      {
        title: "Seek Medical Care",
        description: "Call 911 if: first-time seizure, seizure lasts >5 minutes, person doesn't wake up, multiple seizures, or injury occurs.",
        important: true
      }
    ]
  };

  const protocolWarnings: Record<string, string[]> = {
    "cpr-2025": [
      "If untrained, provide hands-only CPR without rescue breaths",
      "Don't be afraid to push hard - broken ribs heal, brain damage doesn't",
      "Never leave the person alone to look for an AED"
    ],
    "choking-2025": [
      "Never perform abdominal thrusts on pregnant women or infants under 1 year",
      "Don't use finger sweeps unless you can see the object",
      "Seek medical attention even after successful removal"
    ],
    "stroke-2025": [
      "Don't give aspirin unless directed by emergency services",
      "Don't give food or water - swallowing may be impaired",
      "Time is critical - every minute counts"
    ],
    "bleeding-control-2025": [
      "Don't remove objects impaled in the body - stabilize them",
      "Use universal precautions - wear gloves or barrier protection",
      "Tourniquets should only be used for life-threatening limb bleeding"
    ],
    "burns-2025": [
      "Never use ice on burns - it causes further tissue damage",
      "Don't break blisters or remove clothing stuck to burns",
      "For chemical burns, flush with water for at least 20 minutes"
    ],
    "heart-attack-2025": [
      "Don't give aspirin if person is allergic or has bleeding disorders",
      "Don't delay calling 911 to give medications",
      "Don't drive to hospital - wait for EMS"
    ],
    "anaphylaxis-2025": [
      "Don't delay epinephrine injection if available",
      "Don't give oral medications during anaphylaxis",
      "Be prepared for biphasic reaction - symptoms can return"
    ]
  };

  const protocolNotes: Record<string, string[]> = {
    "cpr-2025": [
      "Hands-only CPR is effective for untrained bystanders",
      "If trained, provide 30 compressions followed by 2 rescue breaths",
      "Use an AED as soon as available"
    ],
    "choking-2025": [
      "For infants, use back blows and chest thrusts only",
      "For pregnant women, use chest thrusts instead of abdominal thrusts",
      "If alone and choking, use chair back for self-administered thrusts"
    ],
    "stroke-2025": [
      "BE-FAST is more comprehensive than older FAST assessment",
      "Transport to stroke center if available",
      "Golden hour is critical for treatment options"
    ],
    "bleeding-control-2025": [
      "Stop the Bleed training is recommended for all citizens",
      "Direct pressure is effective for most bleeding",
      "Document time of tourniquet application"
    ],
    "burns-2025": [
      "Rule of nines helps estimate burn surface area",
      "Children have different body proportions",
      "Inhalation injury suspected with enclosed space burns"
    ],
    "heart-attack-2025": [
      "Women often have atypical heart attack symptoms",
      "Time to treatment is critical for heart muscle preservation",
      "Aspirin helps prevent further clot formation"
    ],
    "anaphylaxis-2025": [
      "Epinephrine is the first-line treatment",
      "Antihistamines are not sufficient for severe reactions",
      "Always transport to hospital even if symptoms improve"
    ]
  };

  return {
    id: basicProtocol.id,
    title: basicProtocol.title,
    description: basicProtocol.description,
    steps: protocolSteps[id] || [
      {
        title: "Scene Assessment",
        description: "Assess the situation for safety hazards and determine the nature of the emergency. Ensure your safety before approaching the victim.",
        important: true
      },
      {
        title: "Call for Emergency Help",
        description: "Call 911 immediately for any serious emergency. Provide location, nature of emergency, and number of victims.",
        important: true
      },
      {
        title: "Provide Appropriate Care",
        description: "Follow standard first aid protocols appropriate for the specific emergency. Monitor the victim until professional help arrives.",
        important: true
      },
      {
        title: "Monitor Vital Signs",
        description: "Continuously monitor breathing, pulse, and consciousness level. Be prepared to perform CPR if needed.",
        important: true
      },
      {
        title: "Prepare for EMS Arrival",
        description: "Gather information about the incident and victim's condition to report to emergency medical services when they arrive.",
        important: false
      }
    ],
    warnings: protocolWarnings[id] || ["Always ensure your safety first", "Call emergency services when in doubt", "Don't exceed your training level"],
    notes: protocolNotes[id] || ["This protocol should be performed by trained individuals when possible", "Regular first aid training is recommended"]
  };
};

export default function ProtocolDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      const protocolData = getProtocolById(params.id);
      setProtocol(protocolData);
      setLoading(false);
    }
  }, [params.id]);

  const handlePrint = () => {
    window.print();
  };

  const handleShare = async () => {
    if (navigator.share && protocol) {
      try {
        await navigator.share({
          title: protocol.title,
          text: protocol.description,
          url: window.location.href,
        });
      } catch (error) {
        navigator.clipboard.writeText(window.location.href);
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  const handleSave = () => {
    localStorage.setItem(`saved-protocol-${protocol?.id}`, JSON.stringify(protocol));
    alert("Protocol saved successfully!");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Protocol Not Found</h1>
          <p className="text-gray-600 mb-8">The requested emergency protocol could not be found.</p>
          <Link href="/emergency">
            <div className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Protocols
            </div>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link href="/emergency">
          <div className="inline-flex items-center text-primary hover:text-primary/80 mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to All Protocols
          </div>
        </Link>
        
        <div className="bg-gradient-to-r from-red-600 to-primary p-6 rounded-lg text-white mb-6">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center mb-2">
                <AlertTriangle className="w-6 h-6 mr-3" />
                <span className="text-sm font-medium uppercase tracking-wide">Emergency Protocol</span>
              </div>
              <h1 className="text-3xl font-bold mb-2">{protocol.title}</h1>
              <p className="text-xl opacity-90">{protocol.description}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 mb-6">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Printer className="w-4 h-4 mr-2" />
            Print
          </button>
          <button
            onClick={handleShare}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Share2 className="w-4 h-4 mr-2" />
            Share
          </button>
          <button
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Bookmark className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>
      </div>

      {/* Protocol Steps */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-primary" />
          Step-by-Step Instructions
        </h2>
        
        <div className="space-y-4">
          {protocol.steps.map((step, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg border-l-4 ${
                step.important 
                  ? "bg-red-50 border-red-500" 
                  : "bg-gray-50 border-gray-300"
              }`}
            >
              <div className="flex items-start">
                <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                  step.important ? "bg-red-500" : "bg-gray-500"
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Professional Video Guides */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-red-600" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
          Professional Video Demonstrations
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {protocol.steps.filter(step => step.videoUrl).map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="aspect-video bg-gray-900 relative">
                <iframe
                  src={step.videoUrl?.replace('watch?v=', 'embed/') || ''}
                  className="w-full h-full"
                  allowFullScreen
                  title={step.title}
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-gray-800 mb-2">{step.title}</h3>
                <p className="text-sm text-gray-600">Professional demonstration of proper technique</p>
              </div>
            </div>
          ))}
        </div>
        
        {protocol.steps.filter(step => step.videoUrl).length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">Professional video demonstrations will be added soon</p>
          </div>
        )}
      </div>

      {/* Photo Guides */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Step-by-Step Photo Guides
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {protocol.steps.filter(step => step.imageUrl).map((step, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200">
              <div className="aspect-square bg-gray-100 relative">
                <img
                  src={step.imageUrl}
                  alt={step.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkltYWdlIEd1aWRlPC90ZXh0Pjwvc3ZnPg==';
                  }}
                />
              </div>
              <div className="p-3">
                <h3 className="font-medium text-gray-800 text-sm mb-1">{step.title}</h3>
                <p className="text-xs text-gray-600">Visual guide for proper technique</p>
              </div>
            </div>
          ))}
        </div>
        
        {protocol.steps.filter(step => step.imageUrl).length === 0 && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
            <svg className="w-12 h-12 mx-auto text-gray-400 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p className="text-gray-600">Professional photo guides will be added soon</p>
          </div>
        )}
      </div>

      {/* Warnings */}
      {protocol.warnings && protocol.warnings.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <AlertTriangle className="w-6 h-6 mr-3 text-red-500" />
            Important Warnings
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <ul className="space-y-2">
              {protocol.warnings.map((warning, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700">{warning}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Additional Notes */}
      {protocol.notes && protocol.notes.length > 0 && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Info className="w-6 h-6 mr-3 text-blue-500" />
            Additional Notes
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-2">
              {protocol.notes.map((note, index) => (
                <li key={index} className="flex items-start">
                  <Info className="w-5 h-5 text-blue-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-blue-700">{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Emergency Contact */}
      <div className="bg-red-600 text-white p-6 rounded-lg text-center">
        <h2 className="text-xl font-bold mb-2">Emergency Contact</h2>
        <p className="text-lg mb-2">If this is a life-threatening emergency</p>
        <p className="text-3xl font-bold">Call 911 Immediately</p>
        <p className="text-sm mt-2 opacity-90">This guide is for educational purposes and does not replace professional medical training</p>
      </div>
    </div>
  );
}