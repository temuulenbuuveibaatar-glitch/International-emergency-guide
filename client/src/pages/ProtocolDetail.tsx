import { useParams } from "wouter";
import { emergencyProtocols } from "../data/protocols";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Clock, CheckCircle, ArrowLeft, Lightbulb } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function ProtocolDetail() {
  const { id } = useParams();
  const { t } = useTranslation();
  
  if (!id) {
    return <div>Protocol not found</div>;
  }

  const protocol = emergencyProtocols.find(p => p.id === id);
  
  if (!protocol) {
    return <div>Protocol not found</div>;
  }

  const protocolSteps: Record<string, any[]> = {
    "cpr-2025": [
      {
        title: "Check Responsiveness",
        description: "Tap shoulders firmly and shout 'Are you okay?' Look for normal breathing for no more than 10 seconds. If unresponsive and not breathing normally, begin CPR.",
        important: true,
        duration: "10 seconds",
        tips: ["Don't waste time checking pulse", "Gasping is not normal breathing", "Act quickly - brain damage starts in 4-6 minutes"]
      },
      {
        title: "Call for Help",
        description: "Call 911 immediately or have someone else do it. Request an AED if available. If alone with phone, put on speaker. Don't leave to get help.",
        important: true,
        duration: "30 seconds",
        tips: ["Speaker phone allows continued CPR", "AED is crucial for survival", "Every second counts"]
      },
      {
        title: "Position Person",
        description: "Place on firm, flat surface. Tilt head back slightly by lifting chin. Place heel of one hand on center of chest between nipples. Place other hand on top, interlacing fingers.",
        important: true,
        duration: "15 seconds",
        tips: ["Firm surface is essential", "Center of chest, not too high", "Keep arms straight"]
      },
      {
        title: "Begin Chest Compressions",
        description: "Push hard and fast at least 2 inches deep. Allow complete chest recoil between compressions. Compress at 100-120 per minute. Count out loud: '1 and 2 and...'",
        important: true,
        duration: "Continuous cycles",
        tips: ["Think 'Stayin' Alive' tempo", "Let chest come back up completely", "Don't lean on chest"]
      },
      {
        title: "Provide Rescue Breaths (if trained)",
        description: "After 30 compressions, tilt head back, lift chin, pinch nose. Cover mouth completely and give 2 breaths (1 second each). Watch for chest rise.",
        important: false,
        duration: "5 seconds",
        tips: ["Untrained: hands-only CPR is fine", "Don't over-ventilate", "Chest should rise with each breath"]
      },
      {
        title: "Continue Until Help Arrives",
        description: "Don't stop until EMS arrives, person starts breathing normally, or you become exhausted. Use AED immediately when available and follow voice prompts.",
        important: true,
        duration: "Until relieved by professionals",
        tips: ["Quality compressions save lives", "AED will guide you through process", "Don't give up - brain can survive longer than you think"]
      }
    ],
    "choking-2025": [
      {
        title: "Assess the Situation",
        description: "Look for universal choking sign (hands clutching throat). Ask 'Are you choking?' If person can cough, speak, or breathe, encourage coughing. If cannot breathe, cough, or speak, begin immediate intervention.",
        important: true,
        duration: "5-10 seconds",
        tips: ["Coughing means some air is moving", "Silent choking is more dangerous", "Act quickly but stay calm"]
      },
      {
        title: "Position for Back Blows",
        description: "Stand to side and slightly behind. Support chest with one hand, lean them forward so object falls out rather than down throat. For children, support over your forearm.",
        important: true,
        duration: "5 seconds",
        tips: ["Forward position is crucial", "Support them securely", "Different technique for infants"]
      },
      {
        title: "Give 5 Sharp Back Blows",
        description: "Using heel of hand, give up to 5 sharp blows between shoulder blades. Each blow separate and distinct. Check mouth after each blow for expelled object using finger sweep if visible.",
        important: true,
        duration: "15-20 seconds",
        tips: ["Each blow should be forceful", "Only remove visible objects", "Don't do blind finger sweeps"]
      },
      {
        title: "Perform 5 Abdominal Thrusts",
        description: "Stand behind person. Place fist above navel, below ribs. Grasp with other hand, give 5 quick upward/inward thrusts. For pregnant/obese persons, use chest thrusts.",
        important: true,
        duration: "15-20 seconds",
        tips: ["Above navel, below ribs", "Quick, upward motion", "Modify for pregnancy/obesity"]
      },
      {
        title: "Continue Alternating Techniques",
        description: "Keep alternating 5 back blows and 5 abdominal thrusts until object expelled, person can breathe/speak, or becomes unconscious. Stay with person throughout.",
        important: true,
        duration: "Until successful or unconscious",
        tips: ["Don't give up quickly", "Encourage coughing between cycles", "Be ready for sudden success"]
      },
      {
        title: "If Person Becomes Unconscious",
        description: "Lower to ground, call 911 if not done. Begin CPR with chest compressions. Before rescue breaths, check mouth and remove visible objects only. Continue CPR until help arrives.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["CPR may dislodge object", "Check mouth before each breath cycle", "Don't stop compressions to search for object"]
      }
    ],
    "stroke-2025": [
      {
        title: "Balance - Check for Loss of Coordination",
        description: "Ask about sudden balance loss, dizziness, or coordination problems. Look for trouble walking, loss of coordination, unexplained falls. If safe, ask person to walk and observe for unsteadiness.",
        important: true,
        duration: "30 seconds",
        tips: ["May be only sign of posterior stroke", "Ask about recent falls", "Sudden onset is key"]
      },
      {
        title: "Eyes - Check for Vision Loss",
        description: "Ask about sudden vision loss, double vision, or visual field cuts. Have them track your finger. Ask if they can see your whole face. Test peripheral vision by wiggling fingers.",
        important: true,
        duration: "30 seconds",
        tips: ["Vision changes can be subtle", "Check both eyes", "May complain of 'dark areas'"]
      },
      {
        title: "Face - Check for Facial Drooping",
        description: "Ask person to smile broadly showing teeth. Look for uneven/lopsided smile, facial drooping, or asymmetric movement. Have them puff cheeks or raise eyebrows.",
        important: true,
        duration: "30 seconds",
        tips: ["Most recognizable stroke sign", "Check both sides of face", "May affect speech muscles too"]
      },
      {
        title: "Arms - Check for Weakness",
        description: "Ask to raise both arms overhead for 10 seconds with palms up, eyes closed. Look for arm drift, inability to lift one arm, or weakness. Test grip strength simultaneously.",
        important: true,
        duration: "30 seconds",
        tips: ["One-sided weakness is classic", "Compare both sides", "May be subtle initially"]
      },
      {
        title: "Speech - Check for Speech Problems",
        description: "Ask to repeat simple phrase like 'The early bird catches the worm'. Listen for slurred speech, wrong words, or inability to understand. Test comprehension with simple commands.",
        important: true,
        duration: "30 seconds",
        tips: ["Speech problems are very common", "Check understanding too", "May have trouble finding words"]
      },
      {
        title: "Time - Call 911 Immediately",
        description: "If ANY signs present, note exact time symptoms started (or last seen normal) and call 911. Tell dispatcher 'possible stroke' and time of onset. Time is brain - every minute counts.",
        important: true,
        duration: "2-3 minutes",
        tips: ["Don't wait for more symptoms", "Time determines treatment options", "Transport to stroke center if available"]
      }
    ],
    "bleeding-control-2025": [
      {
        title: "Scene Safety and Protection",
        description: "Assess scene for ongoing dangers (traffic, violence, hazards). Wear gloves or create barrier with plastic bags/cloth. Your safety first - you can't help if you become injured.",
        important: true,
        duration: "15-30 seconds",
        tips: ["Universal precautions with blood", "Use any barrier available", "Don't become second victim"]
      },
      {
        title: "Call 911 for Severe Bleeding",
        description: "Call immediately for life-threatening bleeding. Say 'severe bleeding/hemorrhage' and location. Request blood products and trauma team for massive bleeding.",
        important: true,
        duration: "30 seconds",
        tips: ["Don't delay for severe bleeding", "Be specific about severity", "Designate someone else to call if possible"]
      },
      {
        title: "Apply Direct Pressure",
        description: "Place clean cloth/gauze directly on wound. Press firmly with both hands if needed. Don't peek or lift to check - maintain constant pressure. Add more material on top if blood soaks through.",
        important: true,
        duration: "Continuous pressure",
        tips: ["Most effective bleeding control", "Don't remove blood-soaked materials", "Use whatever clean material available"]
      },
      {
        title: "Elevate if Possible",
        description: "If no fracture suspected, raise bleeding area above heart level. Support while maintaining pressure. Don't elevate if spinal, neck, or bone injuries suspected.",
        important: false,
        duration: "Throughout care",
        tips: ["Works best for arms and legs", "Gravity helps reduce blood flow", "Don't compromise direct pressure"]
      },
      {
        title: "Pressure Points if Needed",
        description: "If direct pressure fails, apply pressure to arterial points between wound and heart. Arm wounds: brachial artery. Leg wounds: femoral artery in groin.",
        important: true,
        duration: "Until bleeding controlled",
        tips: ["Use only if direct pressure insufficient", "Learn pressure point locations", "Maintain direct pressure while applying"]
      },
      {
        title: "Tourniquet for Life-Threatening Limb Bleeding",
        description: "For severe limb bleeding not controlled by pressure, apply tourniquet 2-3 inches above wound. Tighten until bleeding stops. Write time on tourniquet. Don't loosen once applied.",
        important: true,
        duration: "Until medical professionals remove",
        tips: ["Last resort for limb bleeding", "Commercial tourniquets preferred", "Document time of application"]
      }
    ],
    "heart-attack-2025": [
      {
        title: "Recognize Heart Attack Symptoms",
        description: "Classic: chest pain/pressure, shortness of breath, nausea, sweating, pain to arms/jaw/back. Women/diabetics may have atypical symptoms: fatigue, indigestion, back/jaw pain without chest pain.",
        important: true,
        duration: "Ongoing assessment",
        tips: ["Don't wait for 'classic' symptoms", "Women often have different symptoms", "Trust your instincts"]
      },
      {
        title: "Call 911 - Don't Drive",
        description: "Call immediately, don't drive to hospital. Say 'possible heart attack' with location. Request ALS and cardiac team activation. EMS can start treatment and bypass ER.",
        important: true,
        duration: "2-3 minutes",
        tips: ["EMS has better outcomes", "Treatment starts immediately", "Direct to cardiac center"]
      },
      {
        title: "Give Aspirin if Safe",
        description: "Give 325mg aspirin (4 baby aspirin) to chew if conscious, not allergic, no bleeding disorders. Chewing is faster than swallowing. Don't delay 911 call for aspirin.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Chewing speeds absorption", "Don't give if allergic", "Prevention of further clot formation"]
      },
      {
        title: "Position for Comfort",
        description: "Help sit upright in chair or half-sitting with pillows - reduces heart workload. Loosen tight clothing. Keep calm and still. Don't let them walk around.",
        important: false,
        duration: "Throughout care",
        tips: ["Sitting position reduces cardiac workload", "Keep them calm", "No exertion"]
      },
      {
        title: "Monitor for Cardiac Arrest",
        description: "Watch breathing and consciousness continuously. Be prepared for CPR if becomes unconscious or stops breathing. Heart attack can progress to cardiac arrest.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Heart attack can worsen quickly", "Be ready to start CPR", "Stay with patient"]
      }
    ],
    "respiratory-distress-2025": [
      {
        title: "Assess Breathing Emergency",
        description: "Check for severe shortness of breath, inability to speak in full sentences, blue lips/fingernails, gasping, or wheezing. Look for use of accessory muscles (neck, shoulder).",
        important: true,
        duration: "30 seconds",
        tips: ["Can't speak = severe emergency", "Blue color = oxygen emergency", "Sitting upright = breathing easier"]
      },
      {
        title: "Call 911 for Severe Distress",
        description: "Call immediately if severe symptoms present. Say 'breathing emergency' and describe symptoms. Request advanced life support and respiratory therapist.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Don't delay for severe symptoms", "Describe exact breathing pattern", "Request oxygen equipment"]
      },
      {
        title: "Position for Optimal Breathing", 
        description: "Help sit upright in tripod position (leaning forward, hands on knees). Open windows for fresh air. Loosen tight clothing around neck and chest.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Upright position helps breathing", "Fresh air can help", "Remove restrictive clothing"]
      },
      {
        title: "Assist with Rescue Inhaler",
        description: "If person has prescribed inhaler (albuterol), help them use it. Shake well, have them exhale fully, seal lips around mouthpiece, press and inhale slowly and deeply.",
        important: false,
        duration: "2-3 minutes",
        tips: ["Only use their prescribed inhaler", "Slow, deep inhalation", "Can repeat every 20 minutes"]
      },
      {
        title: "Monitor and Reassure",
        description: "Stay calm and keep person calm. Monitor breathing continuously. Be prepared for CPR if they become unconscious. Count respirations per minute.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Anxiety worsens breathing", "Normal rate: 12-20 breaths/min", "Be ready for CPR"]
      }
    ],
    "burns-2025": [
      {
        title: "Ensure Scene Safety",
        description: "Remove from heat source if safe. Turn off electricity for electrical burns. Check for ongoing fire, chemical, or electrical hazards. Don't become another victim.",
        important: true,
        duration: "30 seconds",
        tips: ["Your safety first", "Remove heat source, not person", "Check for electrical hazards"]
      },
      {
        title: "Assess Burn Severity",
        description: "1st degree: red, painful. 2nd degree: blisters, very painful. 3rd degree: white/charred, little pain. Call 911 for large burns, face/hands/genitals, or 3rd degree burns.",
        important: true,
        duration: "1-2 minutes", 
        tips: ["Size matters - palm = 1% body", "Location important", "3rd degree = immediate 911"]
      },
      {
        title: "Cool the Burn",
        description: "Cool running water for 10-20 minutes (not ice). Remove jewelry/clothing before swelling starts. For chemical burns, flush for 20+ minutes. Pat dry gently.",
        important: true,
        duration: "10-20 minutes",
        tips: ["Cool water, not ice", "Remove jewelry early", "Chemical burns need longer flushing"]
      },
      {
        title: "Cover and Protect",
        description: "Cover with sterile gauze or clean cloth. Don't use cotton balls or adhesive bandages on burn. For large burns, use clean sheet. Don't break blisters.",
        important: true,
        duration: "5 minutes",
        tips: ["Sterile covering preferred", "Don't break blisters", "Protect from infection"]
      },
      {
        title: "Manage Pain and Shock",
        description: "Give over-the-counter pain medication if conscious. Elevate burned area if possible. Watch for shock (rapid pulse, pale, cool skin). Keep warm if in shock.",
        important: false,
        duration: "Ongoing",
        tips: ["Pain medication helps healing", "Elevation reduces swelling", "Burns can cause shock"]
      }
    ],
    "fractures-2025": [
      {
        title: "Assess for Fracture",
        description: "Look for deformity, swelling, inability to bear weight, severe pain, numbness/tingling. Compare to uninjured side. Check circulation, sensation, movement below injury.",
        important: true,
        duration: "2-3 minutes",
        tips: ["Compare both sides", "Check pulse below injury", "Document what you find"]
      },
      {
        title: "Control Any Bleeding",
        description: "If open fracture (bone showing), control bleeding with direct pressure around the bone. Don't push bone back in. Cover with sterile dressing.",
        important: true,
        duration: "Variable",
        tips: ["Don't push bone in", "Pressure around, not on bone", "Open fracture = surgery needed"]
      },
      {
        title: "Immobilize the Fracture",
        description: "Splint above and below the fracture. Use rigid material (boards, magazines). Pad splint with soft material. Don't over-tighten - should fit snugly but not cut circulation.",
        important: true,
        duration: "10-15 minutes",
        tips: ["Include joints above/below", "Pad the splint", "Check circulation after splinting"]
      },
      {
        title: "Check Circulation Frequently",
        description: "Check pulse, skin color, temperature, sensation below injury every 15 minutes. If circulation compromised, loosen splint slightly. Watch for increasing pain or numbness.",
        important: true,
        duration: "Every 15 minutes",
        tips: ["Pulse should be present", "Skin should be warm/pink", "Loosen if circulation poor"]
      },
      {
        title: "Prepare for Transport",
        description: "Keep person still and comfortable. Elevate if possible to reduce swelling. Apply ice wrapped in cloth for 20 minutes every hour. Give pain medication if conscious.",
        important: false,
        duration: "Until medical care",
        tips: ["Ice reduces swelling", "Elevation helps", "Document time of injury"]
      }
    ],
    "seizure-2025": [
      {
        title: "Protect from Injury",
        description: "Clear area of hard objects. Place something soft under head. Don't restrain or hold down. Turn on side if possible to keep airway clear. Time the seizure.",
        important: true,
        duration: "Duration of seizure",
        tips: ["Don't restrain the person", "Clear dangerous objects", "Time is important information"]
      },
      {
        title: "Do NOT Put Anything in Mouth",
        description: "Never put fingers, spoons, or objects in mouth. Person cannot swallow tongue. May bite down hard and cause injury. Keep airway clear by positioning only.",
        important: true,
        duration: "Throughout seizure",
        tips: ["Cannot swallow tongue", "May bite objects/fingers", "Positioning keeps airway open"]
      },
      {
        title: "Call 911 If Needed",
        description: "Call for seizure lasting >5 minutes, multiple seizures, injury during seizure, pregnancy, diabetes, first-time seizure, or slow recovery. Document seizure details.",
        important: true,
        duration: "During or after seizure",
        tips: [">5 minutes = status epilepticus", "First seizure needs evaluation", "Document what you observed"]
      },
      {
        title: "Post-Seizure Care",
        description: "Keep on side in recovery position. Check for injuries. Stay with person as they recover. They may be confused, tired, or embarrassed. Provide reassurance and privacy.",
        important: true,
        duration: "15-30 minutes",
        tips: ["Recovery position prevents aspiration", "Confusion is normal", "Provide privacy and reassurance"]
      },
      {
        title: "Monitor for Additional Seizures",
        description: "Watch for signs of another seizure. If multiple seizures occur without full recovery between, call 911 immediately. This is status epilepticus - a medical emergency.",
        important: true,
        duration: "Until fully recovered",
        tips: ["Multiple seizures = emergency", "Status epilepticus is life-threatening", "Full recovery between seizures is normal"]
      }
    ],
    "anaphylaxis-2025": [
      {
        title: "Recognize Severe Allergic Reaction",
        description: "Look for widespread rash/hives, swelling of face/lips/tongue, difficulty breathing, rapid weak pulse, dizziness, nausea/vomiting. Symptoms develop rapidly after exposure.",
        important: true,
        duration: "Seconds to minutes",
        tips: ["Symptoms develop rapidly", "Multiple body systems affected", "Can be fatal within minutes"]
      },
      {
        title: "Call 911 Immediately",
        description: "Call emergency services immediately. Say 'anaphylactic reaction' and request epinephrine and advanced life support. Don't wait to see if symptoms worsen.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Don't wait for worsening", "Emphasize anaphylaxis", "Time is critical"]
      },
      {
        title: "Use Epinephrine Auto-Injector",
        description: "If person has epinephrine (EpiPen), use immediately. Remove safety cap, place against outer thigh, push firmly until it clicks, hold for 3 seconds. Massage injection site.",
        important: true,
        duration: "30 seconds",
        tips: ["Use immediately", "Outer thigh muscle", "Can inject through clothing"]
      },
      {
        title: "Position and Monitor",
        description: "If conscious, keep sitting up. If unconscious or weak pulse, lay flat with legs elevated. If vomiting, turn on side. Monitor breathing and pulse continuously.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Position depends on consciousness", "Legs up for shock", "Side for vomiting"]
      },
      {
        title: "Prepare for Second Dose",
        description: "If no improvement in 5-15 minutes and second EpiPen available, give second dose. May need multiple doses. Be prepared for CPR if condition worsens.",
        important: true,
        duration: "5-15 minutes after first dose",
        tips: ["May need multiple doses", "Document times", "Be ready for CPR"]
      }
    ],
    "hypothermia-2025": [
      {
        title: "Assess Core Temperature",
        description: "Look for shivering, confusion, slurred speech, drowsiness, loss of coordination. Severe: no shivering, muscle rigidity, barely detectable pulse. Check responsiveness gently.",
        important: true,
        duration: "2-3 minutes",
        tips: ["Shivering may stop in severe cases", "Handle gently", "Confusion is early sign"]
      },
      {
        title: "Move to Warm Environment",
        description: "Get out of cold, wind, wet conditions. Move gently - rough handling can trigger dangerous heart rhythms. Remove wet clothing carefully. Handle like fragile glass.",
        important: true,
        duration: "5-10 minutes",
        tips: ["Gentle movements only", "Remove wet clothing", "Protect from wind"]
      },
      {
        title: "Begin Gradual Rewarming",
        description: "Wrap in dry blankets, warm clothes. Apply warm (not hot) packs to trunk, not extremities. Share body heat if available. Insulate from ground.",
        important: true,
        duration: "Ongoing",
        tips: ["Gradual warming only", "Warm the core first", "Avoid hot packs on arms/legs"]
      },
      {
        title: "Give Warm Beverages if Conscious",
        description: "If fully conscious and able to swallow, give warm, sweet drinks. No alcohol or caffeine. Small sips only. Stop if any swallowing problems.",
        important: false,
        duration: "Ongoing if conscious",
        tips: ["Only if fully conscious", "No alcohol/caffeine", "Small sips prevent choking"]
      },
      {
        title: "Monitor and Evacuate",
        description: "Watch for cardiac arrest - be ready for CPR. Evacuate to medical facility. Continue warming during transport. Handle very gently throughout.",
        important: true,
        duration: "Until hospital care",
        tips: ["Cardiac arrest risk high", "Continue warming during transport", "Gentle handling critical"]
      }
    ],
    "diabetic-emergency-2025": [
      {
        title: "Assess Blood Sugar Emergency",
        description: "Low sugar: confusion, sweating, shakiness, rapid pulse, hunger. High sugar: frequent urination, excessive thirst, fruity breath, nausea, confusion. Check for medical alert bracelet.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Low = rapid onset", "High = gradual onset", "Check medical alert jewelry"]
      },
      {
        title: "For Low Blood Sugar (Conscious)",
        description: "Give 15g fast-acting sugar: 3-4 glucose tablets, 4oz fruit juice, 1 tablespoon honey. Wait 15 minutes, recheck. Repeat if still low. Then give protein snack.",
        important: true,
        duration: "15-30 minutes",
        tips: ["15g rule", "Fast-acting sugar", "Follow with protein"]
      },
      {
        title: "For High Blood Sugar",
        description: "Call 911 if vomiting, severe dehydration, fruity breath, or unconscious. Give small sips of water if conscious. Don't give insulin unless trained and prescribed.",
        important: true,
        duration: "Variable",
        tips: ["Fruity breath = ketoacidosis", "Small amounts of water only", "Don't give insulin"]
      },
      {
        title: "If Unconscious",
        description: "Call 911 immediately. Don't give anything by mouth. Place in recovery position. Be prepared for CPR. If trained and available, give glucagon injection.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Nothing by mouth", "Recovery position", "Glucagon if trained"]
      },
      {
        title: "Monitor and Document",
        description: "Watch for changes in consciousness. Note time of onset, what they ate, medication times. Stay with person until medical help arrives or fully recovered.",
        important: true,
        duration: "Until recovered",
        tips: ["Document timeline", "Note recent meals/meds", "Watch for changes"]
      }
    ],
    "trauma-assessment-2025": [
      {
        title: "Ensure Scene Safety",
        description: "Check for ongoing dangers: traffic, fire, structural damage, violence. Wear protective equipment if available. Call for additional resources if needed. Don't become another victim.",
        important: true,
        duration: "30 seconds",
        tips: ["Scene safety first", "Look for multiple hazards", "Call for backup early"]
      },
      {
        title: "Primary Survey - Airway with C-spine",
        description: "Check airway while maintaining cervical spine immobilization. Look, listen, feel for breathing. Clear visible obstructions. Use jaw-thrust maneuver, not head-tilt chin-lift.",
        important: true,
        duration: "30-60 seconds",
        tips: ["Assume spinal injury", "Jaw-thrust only", "Clear visible objects only"]
      },
      {
        title: "Primary Survey - Breathing",
        description: "Look for chest rise, listen for breath sounds, feel for air movement. Check for tension pneumothorax, flail chest, open chest wounds. Provide ventilation if needed.",
        important: true,
        duration: "30-60 seconds",
        tips: ["Look, listen, feel", "Watch for chest injuries", "Seal open wounds"]
      },
      {
        title: "Primary Survey - Circulation",
        description: "Check pulse, control major bleeding, assess perfusion. Apply direct pressure to bleeding wounds. Check capillary refill and skin color. Look for signs of shock.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Stop the bleeding first", "Check pulse quality", "Watch for shock signs"]
      },
      {
        title: "Primary Survey - Disability/Neurological",
        description: "Check Glasgow Coma Scale (GCS): eye opening, verbal response, motor response. Check pupil size and reaction. Assess for spinal cord injury signs.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Document GCS score", "Check both pupils", "Test sensation/movement"]
      },
      {
        title: "Primary Survey - Exposure/Environment",
        description: "Remove clothing to examine for injuries while preventing hypothermia. Check entire body front and back. Log roll with spinal precautions. Cover to maintain warmth.",
        important: true,
        duration: "2-3 minutes",
        tips: ["Expose to examine", "Prevent heat loss", "Check entire body"]
      }
    ],
    "spinal-injury-2025": [
      {
        title: "Suspect Spinal Injury",
        description: "High-risk mechanisms: falls >3 feet, motor vehicle crashes, diving injuries, sports injuries. Signs: neck/back pain, numbness, weakness, altered sensation below injury level.",
        important: true,
        duration: "Immediate assessment",
        tips: ["Mechanism matters", "Any neurological symptoms", "Age >65 increases risk"]
      },
      {
        title: "Immobilize Cervical Spine",
        description: "Hold head in neutral position with hands. Don't allow movement. Use cervical collar if trained and available. Maintain inline stabilization throughout care.",
        important: true,
        duration: "Throughout care",
        tips: ["Manual stabilization first", "Neutral position", "Don't release until secured"]
      },
      {
        title: "Log Roll Technique",
        description: "Need 3-4 people: one controls head/neck, others control body. Move as single unit. Keep spine aligned. Roll onto backboard if available. One person gives commands.",
        important: true,
        duration: "2-3 minutes",
        tips: ["Team approach", "One person commands", "Move as unit"]
      },
      {
        title: "Neurological Assessment",
        description: "Check sensation: light touch, pinprick. Test motor function: squeeze hands, wiggle toes. Document any deficits. Recheck frequently for changes.",
        important: true,
        duration: "2-3 minutes",
        tips: ["Compare both sides", "Document findings", "Recheck for changes"]
      },
      {
        title: "Secure and Monitor",
        description: "Secure to backboard with straps if available. Pad void spaces. Monitor airway continuously. Watch for breathing difficulties. Keep warm and prepare for transport.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Secure entire body", "Monitor airway closely", "Document any changes"]
      }
    ],
    "head-injury-2025": [
      {
        title: "Assess Level of Consciousness",
        description: "Use Glasgow Coma Scale: Eyes (4), Verbal (5), Motor (6). Best possible score is 15, worst is 3. Document exact responses. Check pupils for size and reaction to light.",
        important: true,
        duration: "2-3 minutes",
        tips: ["Use GCS scale", "Document exact responses", "Check pupils"]
      },
      {
        title: "Look for Danger Signs",
        description: "Severe: vomiting, seizures, severe confusion, unequal pupils, weakness on one side. Moderate: brief loss of consciousness, confusion, amnesia. Call 911 for any head injury with LOC.",
        important: true,
        duration: "Ongoing assessment",
        tips: ["Any LOC = 911", "Watch for vomiting", "Unequal pupils = emergency"]
      },
      {
        title: "Control Cervical Spine",
        description: "Head injury often involves neck injury. Maintain cervical spine immobilization. Don't allow head movement. Use manual stabilization until EMS arrives.",
        important: true,
        duration: "Throughout care",
        tips: ["Assume spinal injury", "Manual stabilization", "No head movement"]
      },
      {
        title: "Control Bleeding",
        description: "Apply direct pressure around wound edges, not directly on skull if fracture suspected. Don't remove objects from head. Cover open wounds with sterile dressing.",
        important: true,
        duration: "Until bleeding controlled",
        tips: ["Pressure around edges", "Don't remove objects", "Cover open wounds"]
      },
      {
        title: "Monitor and Position",
        description: "Keep head elevated 30 degrees if no spinal injury suspected. Monitor consciousness level closely. Watch for vomiting - turn on side if occurs. Document changes.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Elevate head if safe", "Monitor consciousness", "Watch for vomiting"]
      }
    ],
    "heat-illness-2025": [
      {
        title: "Recognize Heat Emergency",
        description: "Heat exhaustion: heavy sweating, weakness, nausea, cool/moist skin. Heat stroke: high body temperature, altered mental state, hot/dry skin, no sweating. Heat stroke = life-threatening.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Sweating vs no sweating", "Mental state changes", "Heat stroke = emergency"]
      },
      {
        title: "Move to Cool Environment",
        description: "Get out of heat immediately. Move to air-conditioned space or shade. Remove excess clothing. Loosen tight clothing. Fan the person if possible.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Cool environment first", "Remove excess clothing", "Fan for evaporation"]
      },
      {
        title: "Begin Aggressive Cooling",
        description: "Apply cool, wet cloths to neck, armpits, groin. Use ice packs wrapped in towel. Give cool water to drink if conscious and not vomiting. Monitor body temperature.",
        important: true,
        duration: "Ongoing",
        tips: ["Cool major pulse points", "Ice packs in towel", "Cool water if conscious"]
      },
      {
        title: "Call 911 for Heat Stroke",
        description: "Call immediately for high body temperature (>103°F), altered mental state, hot dry skin. Continue cooling while waiting. Monitor breathing and consciousness.",
        important: true,
        duration: "If heat stroke signs",
        tips: ["High temp = 911", "Continue cooling", "Monitor closely"]
      },
      {
        title: "Monitor for Complications",
        description: "Watch for seizures, vomiting, loss of consciousness. Continue cooling until body temperature normalizes. Don't overcool - stop when person feels better.",
        important: true,
        duration: "Until recovery",
        tips: ["Watch for seizures", "Don't overcool", "Monitor vital signs"]
      }
    ],
    "drowning-2025": [
      {
        title: "Water Rescue Safety",
        description: "Reach, throw, row, go (in that order). Don't enter water unless trained. Use reaching aids: stick, rope, flotation device. Call for help immediately.",
        important: true,
        duration: "Seconds count",
        tips: ["Don't become victim", "Reach or throw first", "Call for help early"]
      },
      {
        title: "Check Responsiveness",
        description: "Once person is out of water, check consciousness and breathing. Look for chest rise, listen for breath sounds. Check pulse. Assume hypothermia.",
        important: true,
        duration: "30 seconds",
        tips: ["Check breathing first", "Look, listen, feel", "Assume hypothermia"]
      },
      {
        title: "Begin Rescue Breathing",
        description: "If not breathing but has pulse, give rescue breaths immediately. Don't delay for water drainage. Give 1 breath every 5-6 seconds. Check pulse every 2 minutes.",
        important: true,
        duration: "Until breathing returns",
        tips: ["Don't drain water first", "Rescue breaths immediately", "Check pulse frequently"]
      },
      {
        title: "Start CPR if No Pulse",
        description: "If no pulse, begin CPR immediately. Don't try to clear water from lungs. Standard CPR ratios. Continue until EMS arrives or person revives.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Don't clear water", "Standard CPR", "Continue until help arrives"]
      },
      {
        title: "Treat for Hypothermia",
        description: "Remove from cold, remove wet clothing, wrap in blankets. Handle gently - hypothermia increases cardiac arrest risk. Keep horizontal and warm.",
        important: true,
        duration: "Throughout care",
        tips: ["Remove wet clothes", "Handle gently", "Keep warm"]
      }
    ],
    "overdose-naloxone-2025": [
      {
        title: "Recognize Opioid Overdose",
        description: "Signs: unconscious/unresponsive, slow/absent breathing, blue lips/fingernails, gurgling sounds, limp body, pale/clammy skin. May have pinpoint pupils.",
        important: true,
        duration: "30 seconds",
        tips: ["Breathing is key sign", "Blue color = emergency", "Check responsiveness"]
      },
      {
        title: "Call 911 Immediately",
        description: "Call emergency services first. Say 'drug overdose' and request naloxone-equipped responders. Most states have Good Samaritan laws protecting you.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Call 911 first", "Good Samaritan protection", "Request naloxone team"]
      },
      {
        title: "Administer Naloxone",
        description: "Nasal spray: remove cap, insert in nostril, press firmly. Auto-injector: remove caps, place against thigh, press and hold. Give second dose in 2-3 minutes if no response.",
        important: true,
        duration: "30 seconds",
        tips: ["Follow package directions", "Can repeat dose", "Works temporarily"]
      },
      {
        title: "Provide Rescue Breathing",
        description: "If not breathing, tilt head back, lift chin, give rescue breaths. 1 breath every 5-6 seconds. Continue until breathing returns or EMS arrives.",
        important: true,
        duration: "Until breathing returns",
        tips: ["Rescue breathing priority", "1 breath every 5-6 seconds", "Don't stop"]
      },
      {
        title: "Monitor and Prevent Re-overdose",
        description: "Naloxone wears off in 30-90 minutes. Overdose can return. Stay with person until EMS arrives. Turn on side if vomiting. Be prepared to give more naloxone.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Naloxone temporary", "Overdose can return", "Stay with person"]
      }
    ],
    "poisoning-2025": [
      {
        title: "Identify the Poison",
        description: "Try to identify substance: medication bottles, chemical containers, plants. Note amount taken and time. Look for burns around mouth, unusual odors, or altered mental state.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Keep poison container", "Note time and amount", "Look for burns"]
      },
      {
        title: "Call Poison Control",
        description: "Call Poison Control: 1-800-222-1222 (US). Have poison container ready. Follow their specific instructions. They may direct you to hospital or home care.",
        important: true,
        duration: "5-10 minutes",
        tips: ["Have container ready", "Follow exact instructions", "Stay on line"]
      },
      {
        title: "Don't Induce Vomiting",
        description: "Never make person vomit unless specifically told by Poison Control. Some substances cause more damage coming up. Don't give activated charcoal unless directed.",
        important: true,
        duration: "Throughout care",
        tips: ["No vomiting unless told", "Some poisons worse coming up", "Wait for instructions"]
      },
      {
        title: "Skin/Eye Contact",
        description: "For skin contact: remove contaminated clothing, flush with water for 20 minutes. For eye contact: flush with clean water for 20 minutes, holding eyelids open.",
        important: true,
        duration: "20 minutes flushing",
        tips: ["20 minutes minimum", "Remove contaminated clothes", "Hold eyelids open"]
      },
      {
        title: "Monitor and Transport",
        description: "Watch for breathing problems, seizures, loss of consciousness. Bring poison container to hospital. Document time of exposure and symptoms. Follow Poison Control directions.",
        important: true,
        duration: "Until medical care",
        tips: ["Bring container", "Document timeline", "Follow poison control"]
      }
    ],
    "shock-2025": [
      {
        title: "Recognize Shock",
        description: "Signs: rapid weak pulse, low blood pressure, pale/cool/clammy skin, confusion, anxiety, thirst. Causes: bleeding, heart problems, severe infections, allergic reactions.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Rapid weak pulse key", "Pale, cool, clammy", "Multiple causes"]
      },
      {
        title: "Call 911 Immediately",
        description: "Shock is life-threatening. Call for advanced life support immediately. Say 'patient in shock' and describe cause if known. Request blood products if massive bleeding.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Life-threatening emergency", "Describe cause", "Request blood products"]
      },
      {
        title: "Control Bleeding",
        description: "If bleeding present, control immediately with direct pressure, pressure points, or tourniquet for limbs. This is priority in hemorrhagic shock.",
        important: true,
        duration: "Until controlled",
        tips: ["Stop bleeding first", "Use all methods needed", "Tourniquet for limbs"]
      },
      {
        title: "Position Appropriately",
        description: "If no spinal injury: elevate legs 8-12 inches if conscious. If unconscious: recovery position. If chest injury or breathing problems: semi-sitting position.",
        important: true,
        duration: "Throughout care",
        tips: ["Elevate legs if conscious", "Position depends on injury", "Semi-sitting for breathing"]
      },
      {
        title: "Maintain Body Temperature",
        description: "Cover to prevent heat loss but don't overheat. Give nothing by mouth. Monitor breathing and pulse closely. Reassure and keep calm.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Prevent heat loss", "Nothing by mouth", "Monitor closely"]
      }
    ]
  };

  const protocolWarnings: Record<string, string[]> = {
    "cpr-2025": [
      "If untrained, provide hands-only CPR without rescue breaths",
      "Don't be afraid to push hard - broken ribs heal, brain damage doesn't",
      "Never leave the person alone to look for an AED",
      "Don't stop compressions to check for pulse"
    ],
    "choking-2025": [
      "Never perform abdominal thrusts on pregnant women or infants under 1 year",
      "Don't use finger sweeps unless you can see the object",
      "Seek medical attention even after successful removal",
      "For infants: use back blows and chest thrusts only"
    ],
    "stroke-2025": [
      "Don't give aspirin unless directed by emergency services",
      "Don't give food or water - swallowing may be impaired",
      "Time is critical - every minute counts for treatment options",
      "Don't wait for symptoms to worsen"
    ],
    "bleeding-control-2025": [
      "Don't remove objects impaled in the body - stabilize them",
      "Use universal precautions - wear gloves or barrier protection",
      "Tourniquets should only be used for life-threatening limb bleeding",
      "Don't remove blood-soaked bandages - add more on top"
    ],
    "heart-attack-2025": [
      "Don't give aspirin if allergic or has bleeding disorders",
      "Don't delay calling 911 to give medications",
      "Don't drive to hospital - wait for EMS",
      "Don't give nitroglycerin unless prescribed to patient"
    ],
    "respiratory-distress-2025": [
      "Don't give inhaler medications unless prescribed to the patient",
      "Call 911 immediately for blue lips, severe distress, or inability to speak",
      "Don't leave person alone during breathing emergency",
      "Avoid anything that might further restrict breathing"
    ],
    "burns-2025": [
      "Never use ice directly on burns - only cool water",
      "Don't break blisters or remove clothing stuck to burns",
      "Don't apply butter, oil, or home remedies to burns",
      "For chemical burns, flush for at least 20 minutes before transport"
    ],
    "fractures-2025": [
      "Don't try to push protruding bones back into place",
      "Don't move person unless in immediate danger",
      "Check circulation frequently - loosen splint if compromised",
      "Don't give food or water in case surgery is needed"
    ],
    "seizure-2025": [
      "Never put anything in the person's mouth during seizure",
      "Don't restrain or hold down the person",
      "Call 911 for seizures lasting more than 5 minutes",
      "Don't give water or medication until fully conscious"
    ],
    "anaphylaxis-2025": [
      "Use epinephrine immediately - don't wait for symptoms to worsen",
      "Call 911 even if epinephrine seems to help",
      "Don't give oral medications to someone having trouble swallowing",
      "Be prepared for second reaction wave (biphasic anaphylaxis)"
    ],
    "hypothermia-2025": [
      "Handle person very gently - rough movements can cause cardiac arrest",
      "Don't rewarm extremities first - warm the core",
      "Don't give alcohol or caffeine",
      "Don't use direct heat sources (heating pads, fires)"
    ],
    "diabetic-emergency-2025": [
      "Don't give insulin unless trained and it's prescribed to patient",
      "Don't give anything by mouth if person is unconscious",
      "For unknown blood sugar level, treat as low blood sugar if conscious",
      "Call 911 for unconscious diabetic emergency"
    ],
    "trauma-assessment-2025": [
      "Don't move person unless in immediate danger",
      "Assume spinal injury until proven otherwise",
      "Don't skip steps in primary survey - systematic approach saves lives",
      "Control bleeding before proceeding to next assessment step"
    ],
    "spinal-injury-2025": [
      "Never move person with suspected spinal injury unless in immediate danger",
      "Maintain cervical spine immobilization throughout entire care",
      "Log rolling requires trained team - don't attempt alone",
      "Any neurological deficit requires immediate emergency transport"
    ],
    "head-injury-2025": [
      "Any loss of consciousness requires emergency evaluation",
      "Don't give pain medication that might mask symptoms",
      "Unequal pupils indicate dangerous brain pressure",
      "Don't allow person to sleep until cleared by medical professional"
    ],
    "heat-illness-2025": [
      "Heat stroke is life-threatening - cool aggressively and call 911",
      "Don't give salt tablets or concentrated electrolyte solutions",
      "Don't use alcohol-based cooling methods",
      "Stop cooling when person feels better to prevent hypothermia"
    ],
    "drowning-2025": [
      "Don't enter water unless you're a trained water rescue professional",
      "Don't attempt to drain water from lungs - start rescue breathing immediately",
      "Assume all drowning victims have hypothermia and spinal injury",
      "Even successful water rescue requires medical evaluation"
    ],
    "overdose-naloxone-2025": [
      "Naloxone is temporary - overdose effects can return in 30-90 minutes",
      "Don't leave person alone after giving naloxone",
      "Multiple doses may be needed - don't hesitate to repeat",
      "Good Samaritan laws protect you when helping overdose victims"
    ],
    "poisoning-2025": [
      "Never induce vomiting unless specifically directed by Poison Control",
      "Don't give activated charcoal unless directed by professionals",
      "Don't try to neutralize poisons with household substances",
      "Always bring poison container to hospital for identification"
    ],
    "shock-2025": [
      "Shock is always life-threatening - call 911 immediately",
      "Don't give anything by mouth to person in shock",
      "Control bleeding first before treating for shock",
      "Don't elevate legs if spinal injury suspected"
    ],
    "pediatric-emergencies-2025": [
      "Children can't be treated like small adults - different physiology",
      "Don't give adult medications without weight-based dosing",
      "Children deteriorate quickly - early intervention critical",
      "Keep parents calm to keep child calm"
    ],
    "childbirth-2025": [
      "Don't pull on baby or cord during delivery",
      "Don't cut umbilical cord unless trained and have sterile equipment",
      "If complications arise, call 911 and prepare for transport",
      "Keep baby warm - newborns lose heat rapidly"
    ],
    "mental-health-2025": [
      "Don't promise absolute confidentiality - safety comes first",
      "Don't leave suicidal person alone",
      "Don't argue with delusions or hallucinations",
      "Don't transport potentially violent person alone"
    ],
    "electrical-injury-2025": [
      "Never touch person still in contact with electricity",
      "Don't use water near electrical sources",
      "All electrical injuries need cardiac monitoring",
      "High voltage can cause internal burns not visible externally"
    ],
    "eye-injury-2025": [
      "Never remove penetrating objects from eye",
      "Don't apply pressure to injured eye",
      "Don't use cotton swabs in eye",
      "Cover both eyes to prevent sympathetic movement"
    ],
    "dental-emergency-2025": [
      "Don't touch tooth root - handle crown only",
      "Don't scrub or use soap on avulsed tooth",
      "Don't let tooth dry out - store in milk or saliva",
      "Time is critical - 30 minutes for best outcome"
    ],
    "animal-bites-2025": [
      "Don't close animal bite wounds tightly",
      "All animal bites need medical evaluation for infection/rabies risk",
      "Don't ignore seemingly minor bites - infection risk high",
      "Wild animal bites require immediate rabies evaluation"
    ],
    "fire-emergency-2025": [
      "Don't use elevators during fire emergency",
      "Don't open hot doors - fire likely behind",
      "Don't re-enter building for belongings",
      "Don't fight fire larger than you - evacuate instead"
    ],
    "fire-safety-equipment-2025": [
      "Don't use water on electrical or grease fires",
      "Don't turn your back on fire after extinguishing",
      "Don't block fire exits or emergency equipment",
      "Wrong extinguisher type can spread fire"
    ]
  };

  const protocolNotes: Record<string, string[]> = {
    "cpr-2025": [
      "Hands-only CPR is effective for untrained bystanders",
      "If trained, provide 30 compressions followed by 2 rescue breaths",
      "Use an AED as soon as available - it will guide you",
      "Quality compressions are more important than speed"
    ],
    "choking-2025": [
      "For infants, use back blows and chest thrusts only",
      "For pregnant women, use chest thrusts instead of abdominal thrusts",
      "If alone and choking, use chair back for self-administered thrusts",
      "Partial obstruction with coughing doesn't require intervention"
    ],
    "stroke-2025": [
      "BE-FAST is more comprehensive than older FAST assessment",
      "Transport to stroke center if available for best outcomes",
      "Golden hour is critical for clot-busting treatments",
      "Even minor symptoms can indicate serious stroke"
    ],
    "bleeding-control-2025": [
      "Stop the Bleed training is recommended for all citizens",
      "Direct pressure is effective for most bleeding emergencies",
      "Document time of tourniquet application clearly",
      "Pressure points are backup when direct pressure fails"
    ],
    "heart-attack-2025": [
      "Women often have atypical heart attack symptoms",
      "Time to treatment is critical for heart muscle preservation",
      "Aspirin helps prevent further clot formation",
      "EMS has better outcomes than driving to hospital"
    ],
    "respiratory-distress-2025": [
      "Upright positioning significantly improves breathing efficiency",
      "Anxiety and panic can worsen breathing difficulties",
      "Rescue inhalers can be repeated every 20 minutes if needed",
      "Blue coloration indicates severe oxygen deprivation"
    ],
    "burns-2025": [
      "Cool water is the most effective immediate treatment",
      "Pain level doesn't always correlate with burn severity",
      "Third-degree burns may require skin grafting",
      "Early cooling prevents progression to deeper burns"
    ],
    "fractures-2025": [
      "Immobilization prevents further damage to surrounding tissues",
      "Open fractures have high infection risk and need immediate surgery",
      "Circulation checks prevent compartment syndrome",
      "Pain management improves patient cooperation"
    ],
    "seizure-2025": [
      "Most seizures stop on their own within 1-2 minutes",
      "Status epilepticus (>5 minutes) can cause permanent brain damage",
      "Recovery time varies but confusion is normal",
      "Document seizure details for medical evaluation"
    ],
    "anaphylaxis-2025": [
      "Epinephrine is the only effective treatment for anaphylaxis",
      "Symptoms can return in biphasic reactions",
      "Antihistamines alone are not sufficient for severe reactions",
      "Even mild initial symptoms can rapidly progress"
    ],
    "hypothermia-2025": [
      "Gentle handling prevents dangerous heart rhythm disturbances",
      "Core rewarming prevents afterdrop complications",
      "Severe hypothermia requires hospital rewarming protocols",
      "Alcohol causes heat loss and impairs judgment"
    ],
    "diabetic-emergency-2025": [
      "Low blood sugar is immediately life-threatening",
      "High blood sugar develops slowly but can be serious",
      "Diabetic ketoacidosis has fruity breath odor",
      "Always follow the 15-15 rule for hypoglycemia"
    ],
    "trauma-assessment-2025": [
      "ABCDE assessment is standard for all trauma patients",
      "Primary survey identifies life-threatening conditions first",
      "Systematic approach prevents missing critical injuries",
      "Each step must be completed before moving to next"
    ],
    "spinal-injury-2025": [
      "Spinal cord injury can occur without fracture",
      "Neurological deficits may be subtle initially",
      "Log rolling prevents further spinal cord damage",
      "Early immobilization improves outcomes significantly"
    ],
    "head-injury-2025": [
      "Glasgow Coma Scale is standard neurological assessment",
      "Pupil changes indicate increased brain pressure",
      "Secondary brain injury develops hours after initial trauma",
      "Loss of consciousness indicates significant brain trauma"
    ],
    "heat-illness-2025": [
      "Heat stroke mortality is high without rapid cooling",
      "Elderly and children are at highest risk",
      "Medications can impair heat regulation",
      "Acclimatization takes 10-14 days"
    ],
    "drowning-2025": [
      "Drowning is silent - victims can't call for help",
      "Secondary drowning can occur hours later",
      "Cold water drowning has better survival rates",
      "CPR success rates are higher in drowning than cardiac arrest"
    ],
    "overdose-naloxone-2025": [
      "Fentanyl overdoses may require multiple naloxone doses",
      "Naloxone only works on opioid overdoses",
      "Person may become agitated when naloxone takes effect",
      "Withdrawal symptoms are uncomfortable but not life-threatening"
    ],
    "poisoning-2025": [
      "Poison Control Center has 24/7 expert toxicologists",
      "Most poisoning deaths are preventable with proper care",
      "Children under 5 have highest poisoning rates",
      "Time since ingestion affects treatment options"
    ],
    "shock-2025": [
      "Early shock recognition dramatically improves survival",
      "Blood loss of 20% causes significant shock",
      "Compensated shock can deteriorate rapidly",
      "Golden hour concept applies to trauma shock"
    ],
    "pediatric-emergencies-2025": [
      "Children have faster heart rates and breathing than adults",
      "Pediatric Assessment Triangle gives rapid overall picture",
      "Weight-based dosing prevents medication errors",
      "Family-centered care improves outcomes and cooperation"
    ],
    "childbirth-2025": [
      "Most deliveries are normal and uncomplicated",
      "Baby's head is largest part - once delivered, rest follows easily",
      "Cord around neck occurs in 20% of births and is usually manageable",
      "Immediate skin-to-skin contact helps temperature regulation"
    ],
    "mental-health-2025": [
      "De-escalation techniques work better than confrontation",
      "Suicide assessment requires direct questions",
      "Mental health crises often involve medical conditions",
      "Safety assessment must include weapons and means"
    ],
    "electrical-injury-2025": [
      "AC current is more dangerous than DC at same voltage",
      "Electrical injuries can cause delayed cardiac arrest",
      "Entry and exit wounds may be far apart",
      "High voltage (>1000V) requires specialized medical care"
    ],
    "eye-injury-2025": [
      "Chemical burns require immediate and prolonged irrigation",
      "Sympathetic movement means both eyes move together",
      "Time is critical in chemical burns - don't delay for transport",
      "Even minor eye injuries can cause significant vision loss"
    ],
    "dental-emergency-2025": [
      "Tooth survival decreases rapidly after 30 minutes",
      "Milk is better storage medium than water",
      "Primary teeth (baby teeth) should not be reimplanted",
      "Root surface damage occurs quickly when tooth dries"
    ],
    "animal-bites-2025": [
      "Animal bites have high infection rates due to bacteria",
      "Cat bites are more likely to cause infection than dog bites",
      "Hand bites require immediate medical attention",
      "Rabies risk varies by animal type and geographic region"
    ],
    "fire-emergency-2025": [
      "RACE protocol ensures systematic fire response",
      "Smoke is more dangerous than flames in most fires",
      "Fire doubles in size every 30 seconds",
      "Closed doors can contain fire for significant time"
    ],
    "fire-safety-equipment-2025": [
      "ABC extinguishers handle most common fire types",
      "Sprinkler systems save more lives than any other fire protection",
      "Fire extinguishers are first aid for fire - not firefighting",
      "Annual inspection and maintenance prevents equipment failure"
    ]
  };

  const quickTips: Record<string, string[]> = {
    "cpr-2025": [
      "Push hard, push fast, minimize interruptions",
      "Think 'Stayin' Alive' song tempo (100-120 BPM)",
      "Switch rescuers every 2 minutes to maintain quality"
    ],
    "choking-2025": [
      "Encourage coughing if they can make sounds",
      "5 back blows, then 5 abdominal thrusts, repeat",
      "If unconscious, start CPR immediately"
    ],
    "stroke-2025": [
      "BE-FAST: Balance, Eyes, Face, Arms, Speech, Time",
      "ANY positive sign = call 911 immediately",
      "Note exact time symptoms started"
    ],
    "bleeding-control-2025": [
      "Direct pressure first, elevation second",
      "Don't remove blood-soaked materials",
      "Tourniquet only for life-threatening limb bleeding"
    ],
    "heart-attack-2025": [
      "Don't wait for 'classic' symptoms",
      "Chew aspirin for faster absorption",
      "EMS provides better outcomes than driving"
    ],
    "respiratory-distress-2025": [
      "Position upright for easier breathing",
      "Stay calm to reduce anxiety",
      "Use prescribed inhaler if available"
    ],
    "burns-2025": [
      "Cool water immediately for 10-20 minutes",
      "Remove jewelry before swelling starts",
      "Cover with clean, dry cloth"
    ],
    "fractures-2025": [
      "Don't move unless absolutely necessary",
      "Splint above and below fracture",
      "Check circulation every 15 minutes"
    ],
    "seizure-2025": [
      "Clear area of dangerous objects",
      "Time the seizure duration",
      "Turn on side after seizure ends"
    ],
    "anaphylaxis-2025": [
      "Use epinephrine immediately",
      "Call 911 even if symptoms improve",
      "Be prepared for second reaction"
    ],
    "hypothermia-2025": [
      "Handle very gently",
      "Warm the core, not extremities",
      "Get to medical care quickly"
    ],
    "diabetic-emergency-2025": [
      "Give sugar if conscious and low blood sugar",
      "Call 911 if unconscious",
      "Check for medical alert bracelet"
    ],
    "trauma-assessment-2025": [
      "Systematic ABCDE approach",
      "Scene safety always first",
      "Control bleeding before moving on"
    ],
    "spinal-injury-2025": [
      "Manual stabilization immediately",
      "Log roll with team coordination",
      "Document neurological deficits"
    ],
    "head-injury-2025": [
      "GCS assessment is critical",
      "Any LOC requires 911",
      "Monitor for deterioration"
    ],
    "heat-illness-2025": [
      "Cool immediately and aggressively",
      "Heat stroke = call 911",
      "Monitor core temperature"
    ],
    "drowning-2025": [
      "Reach or throw before going",
      "Start rescue breathing immediately",
      "Assume hypothermia"
    ],
    "overdose-naloxone-2025": [
      "Give naloxone immediately",
      "Call 911 first",
      "Monitor for re-overdose"
    ],
    "poisoning-2025": [
      "Call Poison Control: 1-800-222-1222",
      "Don't induce vomiting",
      "Bring poison container"
    ],
    "shock-2025": [
      "Control bleeding first",
      "Elevate legs if no spinal injury",
      "Call 911 immediately"
    ],
    "pediatric-emergencies-2025": [
      "Age-appropriate vital signs are different",
      "Keep parents calm to calm child",
      "Weight-based medication dosing"
    ],
    "childbirth-2025": [
      "Support head, don't pull baby",
      "Keep baby warm immediately",
      "Call for help early"
    ],
    "mental-health-2025": [
      "Stay calm and speak slowly",
      "Ask directly about suicide",
      "Don't leave high-risk person alone"
    ],
    "electrical-injury-2025": [
      "Turn off power first",
      "Check heart rhythm immediately",
      "All electrical injuries need evaluation"
    ],
    "eye-injury-2025": [
      "Chemical burns = immediate flushing",
      "Don't remove embedded objects",
      "Cover both eyes"
    ],
    "dental-emergency-2025": [
      "Handle tooth by crown only",
      "30 minutes critical for reimplantation",
      "Store in milk if can't reinsert"
    ],
    "animal-bites-2025": [
      "Clean thoroughly with water",
      "All bites need medical evaluation",
      "Document animal details"
    ],
    "fire-emergency-2025": [
      "RACE: Rescue, Alert, Confine, Extinguish",
      "Stay low in smoke",
      "Never use elevators"
    ],
    "fire-safety-equipment-2025": [
      "PASS technique for extinguishers",
      "Match extinguisher type to fire",
      "ABC handles most fires"
    ],
    "pediatric-emergencies-2025": [
      {
        title: "Pediatric Assessment Triangle",
        description: "Assess appearance (alertness, muscle tone, consolability), work of breathing (respiratory rate, effort, sounds), circulation (skin color, capillary refill). This gives quick overall assessment.",
        important: true,
        duration: "30 seconds",
        tips: ["Appearance most important", "Normal child = alert and consolable", "Trust parental concerns"]
      },
      {
        title: "Age-Specific Vital Signs",
        description: "Infant (0-1yr): HR 100-160, RR 30-60. Toddler (1-3yr): HR 90-150, RR 24-40. Preschool (3-6yr): HR 80-140, RR 22-34. School age (6-12yr): HR 70-120, RR 18-30.",
        important: true,
        duration: "1 minute",
        tips: ["Age affects normal values", "Faster rates normal in children", "Crying affects all measurements"]
      },
      {
        title: "Airway Management",
        description: "Child's head is proportionally larger - use towel under shoulders, not head. Smaller airways obstruct easily. Use appropriate sized equipment. Avoid neck hyperextension.",
        important: true,
        duration: "Variable",
        tips: ["Neutral position best", "Smaller airways = easier obstruction", "Age-appropriate equipment critical"]
      },
      {
        title: "Family-Centered Care",
        description: "Keep calm parent with child when possible. Explain procedures in age-appropriate language. Use comfort items (toys, blankets). Parent's presence often calms child.",
        important: false,
        duration: "Throughout care",
        tips: ["Calm parent = calm child", "Use simple language", "Comfort items help"]
      },
      {
        title: "Special Considerations",
        description: "Children compensate well until sudden decompensation. Weight-based medication dosing. Different injury patterns than adults. Higher surface area to body weight ratio affects heat loss.",
        important: true,
        duration: "Throughout care",
        tips: ["Sudden decompensation possible", "Weight-based dosing", "Prevent heat loss"]
      }
    ],
    "childbirth-2025": [
      {
        title: "Assess Labor Progress",
        description: "Check if baby's head is visible (crowning). If delivery imminent and no time for transport, prepare for emergency delivery. Time contractions - if <2 minutes apart, delivery likely soon.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Crowning = delivery imminent", "Frequent contractions = advanced labor", "Call for help early"]
      },
      {
        title: "Prepare for Delivery",
        description: "Wash hands, put on gloves if available. Position mother with knees drawn up. Place clean towels or sheets under mother. Have warm blankets ready for baby.",
        important: true,
        duration: "2-3 minutes",
        tips: ["Clean hands essential", "Warm environment for baby", "Clean materials only"]
      },
      {
        title: "Support Baby's Head",
        description: "As head emerges, support it gently with hands. Don't pull on baby. Check for umbilical cord around neck - if present, try to slip over head or loop over shoulders.",
        important: true,
        duration: "During delivery",
        tips: ["Support, don't pull", "Let natural process occur", "Check for cord around neck"]
      },
      {
        title: "Deliver Shoulders and Body",
        description: "After head delivers, support as shoulders emerge - upper shoulder first, then lower. Once shoulders out, rest of body follows quickly. Be ready to catch baby.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Upper shoulder first", "Body comes quickly", "Be ready to catch"]
      },
      {
        title: "Immediate Newborn Care",
        description: "Baby should cry immediately. If not breathing, rub back or flick feet. Clear mouth and nose if needed. Dry baby and wrap warmly. Place on mother's chest.",
        important: true,
        duration: "First few minutes",
        tips: ["Crying is good sign", "Stimulate if not breathing", "Keep warm"]
      }
    ],
    "mental-health-2025": [
      {
        title: "Ensure Safety First",
        description: "Assess for immediate danger to self or others. Remove potential weapons or harmful objects. Maintain safe distance if person appears agitated. Call 911 if immediate threat present.",
        important: true,
        duration: "Immediate",
        tips: ["Safety first always", "Remove weapons/harmful objects", "Keep safe distance"]
      },
      {
        title: "Use De-escalation Techniques",
        description: "Speak calmly and slowly. Use non-threatening body language. Listen actively without judgment. Avoid arguing or confronting delusions. Show empathy and respect.",
        important: true,
        duration: "Throughout interaction",
        tips: ["Calm voice and posture", "Listen without judgment", "Don't argue with delusions"]
      },
      {
        title: "Assess Suicide Risk",
        description: "Ask directly about suicidal thoughts: 'Are you thinking about hurting yourself?' Assess plan, means, and intent. Previous attempts increase risk. Don't leave high-risk person alone.",
        important: true,
        duration: "5-10 minutes",
        tips: ["Ask directly about suicide", "Assess plan and means", "Don't leave alone if high risk"]
      },
      {
        title: "Provide Support and Resources",
        description: "Acknowledge their feelings. Offer hope that help is available. Provide crisis hotline numbers. Stay with person until professional help arrives. Don't promise confidentiality.",
        important: true,
        duration: "Until help arrives",
        tips: ["Acknowledge feelings", "Offer hope", "Stay with person"]
      },
      {
        title: "Arrange Safe Transport",
        description: "Call 911 for involuntary commitment if immediate danger. Family/friends can transport if low risk and willing to go voluntarily. Don't transport alone if any safety concerns.",
        important: true,
        duration: "Variable",
        tips: ["911 for immediate danger", "Voluntary transport if safe", "Don't transport alone"]
      }
    ],
    "electrical-injury-2025": [
      {
        title: "Ensure Electrical Safety",
        description: "Turn off power source at breaker if possible. Don't touch person while still in contact with electricity. Use wooden stick or rope to move person from power source. Call utility company for downed power lines.",
        important: true,
        duration: "Before approaching",
        tips: ["Turn off power first", "Don't touch until safe", "Wooden stick to move person"]
      },
      {
        title: "Check for Cardiac Arrest",
        description: "Electrical injury can cause immediate cardiac arrest. Check consciousness and breathing immediately. Be prepared to start CPR. Even minor electrical contact can affect heart rhythm.",
        important: true,
        duration: "Immediately after exposure",
        tips: ["Check heart first", "Be ready for CPR", "Even minor shock affects heart"]
      },
      {
        title: "Assess for Burns",
        description: "Look for entry and exit burn wounds. High voltage can cause internal burns along electrical pathway. Check areas where current likely traveled. Burns may be deeper than they appear.",
        important: true,
        duration: "2-3 minutes",
        tips: ["Look for entry/exit wounds", "Internal burns possible", "May be deeper than visible"]
      },
      {
        title: "Monitor for Complications",
        description: "Watch for heart rhythm abnormalities, muscle contractions, seizures. Check for fractures from falls or muscle contractions. Monitor breathing and circulation closely.",
        important: true,
        duration: "Until medical care",
        tips: ["Watch heart rhythm", "Check for fractures", "Monitor closely"]
      },
      {
        title: "Provide Burn Care",
        description: "Cool burns with water, cover with sterile dressing. Don't use ice or creams. Treat for shock if severe burns present. All electrical injuries need medical evaluation.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Cool water for burns", "No ice or creams", "All need medical evaluation"]
      }
    ],
    "eye-injury-2025": [
      {
        title: "Assess Type of Eye Injury",
        description: "Chemical burns: immediate flushing priority. Foreign body: don't remove if embedded. Blunt trauma: check for vision changes. Penetrating injury: don't remove object, stabilize.",
        important: true,
        duration: "30 seconds",
        tips: ["Type determines treatment", "Don't remove embedded objects", "Chemical = immediate flush"]
      },
      {
        title: "Chemical Eye Burns",
        description: "Flush immediately with clean water for 20+ minutes. Hold eyelids open during flushing. Flush from nose side toward ear. Continue flushing en route to hospital.",
        important: true,
        duration: "20+ minutes",
        tips: ["Immediate flushing priority", "Hold lids open", "Flush nose to ear"]
      },
      {
        title: "Foreign Body in Eye",
        description: "Don't rub eye or try to remove object. If small particle, try gentle eye irrigation. If embedded object, stabilize with bulky dressing around it. Cover both eyes to prevent movement.",
        important: true,
        duration: "Variable",
        tips: ["Don't rub or remove", "Stabilize embedded objects", "Cover both eyes"]
      },
      {
        title: "Penetrating Eye Injury",
        description: "Don't remove object. Stabilize object with bulky dressing taped around it. Cover uninjured eye to prevent sympathetic movement. Keep person calm and still.",
        important: true,
        duration: "Until medical care",
        tips: ["Never remove penetrating object", "Stabilize object", "Cover both eyes"]
      },
      {
        title: "General Eye Care",
        description: "Don't apply pressure to injured eye. Give nothing by mouth in case surgery needed. Transport sitting up if possible. Reassure person - anxiety worsens pain.",
        important: true,
        duration: "Until medical care",
        tips: ["No pressure on eye", "Nothing by mouth", "Sit upright if possible"]
      }
    ],
    "dental-emergency-2025": [
      {
        title: "Tooth Avulsion (Knocked Out)",
        description: "Find tooth, handle by crown only (don't touch root). If dirty, rinse gently with milk or saline. Try to reinsert in socket if possible. If not, store in milk or saliva.",
        important: true,
        duration: "Immediate action needed",
        tips: ["Handle crown only", "Rinse with milk", "Reinsert or store properly"]
      },
      {
        title: "Dental Fractures",
        description: "Save any tooth fragments in milk. Rinse mouth gently with warm water. Apply cold compress to face to reduce swelling. Avoid hot/cold foods and drinks.",
        important: true,
        duration: "Until dental care",
        tips: ["Save fragments", "Gentle rinse", "Cold compress outside"]
      },
      {
        title: "Control Oral Bleeding",
        description: "Rinse mouth gently to remove clots and debris. Apply direct pressure with gauze or clean cloth. Have person bite down on gauze for 10-15 minutes.",
        important: true,
        duration: "Until bleeding stops",
        tips: ["Gentle rinse first", "Direct pressure", "Bite on gauze"]
      },
      {
        title: "Manage Pain and Swelling",
        description: "Give over-the-counter pain medication as directed. Apply cold compress to outside of face for 20 minutes on, 20 minutes off. Don't apply heat.",
        important: false,
        duration: "As needed",
        tips: ["OTC pain meds OK", "Cold compress outside", "No heat application"]
      },
      {
        title: "Seek Urgent Dental Care",
        description: "Avulsed teeth have best outcome if reimplanted within 30 minutes. Call dentist immediately. If unavailable, go to emergency room. Time is critical for tooth survival.",
        important: true,
        duration: "Within 30 minutes",
        tips: ["30 minutes critical", "Call dentist first", "ER if dentist unavailable"]
      }
    ],
    "animal-bites-2025": [
      {
        title: "Control Bleeding",
        description: "Apply direct pressure with clean cloth. Elevate area if possible. Don't close wound tightly - animal bites need drainage. Clean hands before and after care.",
        important: true,
        duration: "Until bleeding controlled",
        tips: ["Direct pressure", "Don't close tightly", "Clean hands"]
      },
      {
        title: "Clean Wound Thoroughly",
        description: "Rinse with clean water for 5+ minutes. Use soap around wound edges. Irrigate deeply if possible. Don't scrub vigorously. Pat dry with clean cloth.",
        important: true,
        duration: "5+ minutes",
        tips: ["Rinse thoroughly", "Soap around edges", "Don't scrub hard"]
      },
      {
        title: "Assess Rabies Risk",
        description: "Higher risk: wild animals (bats, raccoons, skunks), stray animals, unprovoked attacks. Lower risk: domestic pets with current vaccinations. Document animal details.",
        important: true,
        duration: "Assessment",
        tips: ["Wild animals high risk", "Document animal info", "Vaccination status matters"]
      },
      {
        title: "Apply Antibiotic Ointment",
        description: "Apply thin layer of antibiotic ointment if available. Cover with sterile bandage. Don't tape edges tightly closed. Change dressing daily.",
        important: false,
        duration: "During dressing",
        tips: ["Thin layer ointment", "Loose bandage", "Change daily"]
      },
      {
        title: "Seek Medical Care",
        description: "All animal bites need medical evaluation. Deep punctures, hand/face bites, or high rabies risk need immediate care. May need antibiotics, tetanus shot, or rabies treatment.",
        important: true,
        duration: "Within hours",
        tips: ["All bites need evaluation", "Deep/face bites urgent", "May need shots"]
      }
    ],
    "fire-emergency-2025": [
      {
        title: "Rescue - Remove from Danger",
        description: "Remove people from immediate fire danger if safe to do so. Stay low to avoid smoke. Feel doors before opening - hot door = fire behind. Use stairs, never elevators.",
        important: true,
        duration: "Immediate",
        tips: ["Stay low in smoke", "Feel doors first", "Stairs only, no elevators"]
      },
      {
        title: "Alert - Activate Fire Alarm",
        description: "Pull nearest fire alarm. Call 911 and report 'fire' with exact location. Notify others in building. Use voice commands: 'Fire! Get out now!'",
        important: true,
        duration: "Immediately after rescue",
        tips: ["Pull alarm first", "Call 911", "Shout 'Fire!'"]
      },
      {
        title: "Confine - Close Doors",
        description: "Close doors behind you to slow fire spread. Don't lock doors. If safe, close doors to fire area. This buys time for evacuation and firefighting.",
        important: true,
        duration: "During evacuation",
        tips: ["Close doors to slow spread", "Don't lock", "Slows fire progress"]
      },
      {
        title: "Extinguish - If Safe and Small",
        description: "Only fight fire if: escape route clear, fire is small, you know how to use extinguisher. PASS method: Pull pin, Aim at base, Squeeze handle, Sweep side to side.",
        important: false,
        duration: "Only if very small fire",
        tips: ["Only if escape route clear", "PASS method", "Aim at base of flames"]
      },
      {
        title: "Evacuate - Get Out and Stay Out",
        description: "Use nearest safe exit. Go to designated meeting point. Account for all people. Don't re-enter building. Give information to fire department when they arrive.",
        important: true,
        duration: "Until all clear",
        tips: ["Use nearest exit", "Go to meeting point", "Never re-enter"]
      }
    ],
    "fire-safety-equipment-2025": [
      {
        title: "Fire Extinguisher Types",
        description: "Class A: ordinary combustibles (wood, paper). Class B: flammable liquids (gas, oil). Class C: electrical fires. Class D: metals. Class K: cooking oils. ABC extinguishers handle most fires.",
        important: true,
        duration: "Know before emergency",
        tips: ["ABC handles most fires", "Match type to fire", "Wrong type can spread fire"]
      },
      {
        title: "PASS Technique",
        description: "Pull the pin. Aim at base of flames, not the top. Squeeze handle to discharge. Sweep from side to side at base of fire. Stay 6-8 feet away from fire.",
        important: true,
        duration: "During use",
        tips: ["Aim at base, not flames", "Stay 6-8 feet back", "Sweep motion"]
      },
      {
        title: "Fire Sprinkler Systems",
        description: "Don't block sprinkler heads with storage. Each head activates individually when heated. Water damage is less than fire damage. Don't paint over sprinkler heads.",
        important: true,
        duration: "Ongoing awareness",
        tips: ["Don't block heads", "Individual activation", "Don't paint heads"]
      },
      {
        title: "Emergency Lighting",
        description: "Test monthly by pressing test button. Battery backup provides 90+ minutes of light. Don't cover or block emergency lights. Replace if dim or not working.",
        important: false,
        duration: "Monthly testing",
        tips: ["Test monthly", "90+ minute backup", "Don't block lights"]
      },
      {
        title: "Fire Blankets",
        description: "For small clothing fires or grease fires. Turn off heat source first. Pull blanket out quickly. Cover fire completely. Leave in place until cool. Don't peek underneath.",
        important: true,
        duration: "During use",
        tips: ["Turn off heat first", "Cover completely", "Leave until cool"]
      }
    ]
  };

  const steps = protocolSteps[id] || [];
  const warnings = protocolWarnings[id] || [];
  const notes = protocolNotes[id] || [];
  const tips = quickTips[id] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => window.history.back()}
            className="flex items-center gap-2 hover:bg-red-100"
          >
            <ArrowLeft size={20} />
            {t('common.back')}
          </Button>
        </div>

        <Card className="mb-6 border-l-4 border-l-red-500 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-red-500 to-red-600 text-white">
            <CardTitle className="text-2xl flex items-center gap-3">
              <AlertTriangle size={32} />
              {protocol.title}
            </CardTitle>
            <p className="text-red-100 text-lg leading-relaxed">
              {protocol.description}
            </p>
          </CardHeader>
        </Card>

        {/* Quick Tips */}
        {tips.length > 0 && (
          <Card className="mb-6 border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Lightbulb size={24} />
                Quick Reference Tips
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-2">
                {tips.map((tip, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-blue-600 mt-1 flex-shrink-0" />
                    <span className="text-blue-800">{tip}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Protocol Steps */}
        <div className="space-y-6 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-red-500 pb-2">
            Step-by-Step Protocol
          </h2>
          
          {steps.map((step, index) => (
            <Card
              key={index}
              className={`border-l-4 ${
                step.important ? 'border-l-red-500 bg-red-50' : 'border-l-blue-500 bg-blue-50'
              } shadow-md hover:shadow-lg transition-shadow`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="flex items-center gap-3">
                    <Badge
                      variant={step.important ? "destructive" : "secondary"}
                      className="text-sm px-3 py-1"
                    >
                      Step {index + 1}
                    </Badge>
                    <span className={step.important ? 'text-red-800' : 'text-blue-800'}>
                      {step.title}
                    </span>
                  </CardTitle>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Clock size={16} />
                    {step.duration}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className={`text-lg leading-relaxed mb-4 ${
                  step.important ? 'text-red-700' : 'text-blue-700'
                }`}>
                  {step.description}
                </p>
                
                {step.tips && step.tips.length > 0 && (
                  <div className="mt-4">
                    <h4 className={`font-semibold mb-2 ${
                      step.important ? 'text-red-800' : 'text-blue-800'
                    }`}>
                      Key Points:
                    </h4>
                    <ul className="space-y-1">
                      {step.tips.map((tip: string, tipIndex: number) => (
                        <li key={tipIndex} className="flex items-start gap-2">
                          <CheckCircle 
                            size={16} 
                            className={`${
                              step.important ? 'text-red-600' : 'text-blue-600'
                            } mt-1 flex-shrink-0`} 
                          />
                          <span className={`text-sm ${
                            step.important ? 'text-red-700' : 'text-blue-700'
                          }`}>
                            {tip}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Warnings */}
        {warnings.length > 0 && (
          <Card className="mb-6 border-yellow-400 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-800">
                <AlertTriangle size={24} />
                Critical Warnings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {warnings.map((warning, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <AlertTriangle size={16} className="text-yellow-600 mt-1 flex-shrink-0" />
                    <span className="text-yellow-800 font-medium">{warning}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Additional Notes */}
        {notes.length > 0 && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-green-800">Additional Notes</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <div key={index} className="flex items-start gap-2">
                    <CheckCircle size={16} className="text-green-600 mt-1 flex-shrink-0" />
                    <span className="text-green-800">{note}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="mt-8 text-center">
          <Button
            onClick={() => window.history.back()}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3"
          >
            Return to Protocols
          </Button>
        </div>
      </div>
    </div>
  );
}