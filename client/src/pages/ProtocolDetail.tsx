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