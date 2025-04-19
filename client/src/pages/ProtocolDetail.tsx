import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "wouter";
import { emergencyProtocols } from "../data/protocols";
import { AlertTriangle, ArrowLeft, Bookmark, Printer, Share2 } from "lucide-react";

interface ProtocolStep {
  title: string;
  description: string;
  important?: boolean;
}

interface Protocol {
  id: string;
  title: string;
  description: string;
  steps: ProtocolStep[];
  warnings?: string[];
  notes?: string[];
}

// This function would normally fetch data from an API
const getProtocolById = (id: string): Protocol | null => {
  // Extended data for specific protocols
  const protocolData: Record<string, Protocol> = {
    "cpr": {
      id: "cpr",
      title: "CPR Protocol",
      description: "Step-by-step guide for cardiopulmonary resuscitation in emergency situations.",
      steps: [
        {
          title: "Check Responsiveness",
          description: "Tap the person's shoulder and shout 'Are you okay?' to ensure they're unconscious."
        },
        {
          title: "Call for Help",
          description: "Ask someone to call emergency services (103 in Mongolia) and get an AED if available.",
          important: true
        },
        {
          title: "Check Breathing",
          description: "Look for chest movement, listen for breathing sounds, and feel for breath on your cheek for no more than 10 seconds."
        },
        {
          title: "Begin Chest Compressions",
          description: "Place the heel of your hand on the center of the chest, place your other hand on top, position your shoulders above your hands, and push hard and fast at a rate of 100-120 compressions per minute. Allow the chest to completely recoil between compressions.",
          important: true
        },
        {
          title: "Open the Airway",
          description: "Place one hand on the forehead and gently tilt the head back. With your other hand, lift the chin forward to open the airway."
        },
        {
          title: "Give Rescue Breaths",
          description: "Pinch the nose closed, take a normal breath, cover the person's mouth with yours (or use a barrier device), and blow for about 1 second to make the chest rise. Deliver 2 rescue breaths."
        },
        {
          title: "Continue CPR",
          description: "Continue cycles of 30 chest compressions followed by 2 rescue breaths until help arrives or the person shows signs of life."
        },
        {
          title: "Use AED if Available",
          description: "Turn on the AED and follow the prompts. Apply pads to bare chest as shown in the diagram on the pads."
        }
      ],
      warnings: [
        "If you're untrained, provide hands-only CPR (continuous chest compressions without rescue breaths).",
        "Never leave the person alone to look for an AED - send someone else.",
        "Replace the rescuer providing compressions every 2 minutes to avoid fatigue."
      ],
      notes: [
        "For children (1-8 years old): Use one hand for compressions and make the chest compress about 2 inches.",
        "For infants (under 1 year): Use two fingers for compressions and make the chest compress about 1.5 inches."
      ]
    },
    "choking": {
      id: "choking",
      title: "Choking Response",
      description: "Emergency procedures for choking incidents including the Heimlich maneuver.",
      steps: [
        {
          title: "Assess the Severity",
          description: "Determine if the airway is completely or partially blocked. If the person can speak, cough, or breathe, do not interfere."
        },
        {
          title: "Call for Help",
          description: "If the person cannot speak, cough, or breathe, call for emergency services (103 in Mongolia) or have someone else call.",
          important: true
        },
        {
          title: "Heimlich Maneuver (Abdominal Thrusts)",
          description: "Stand behind the person and wrap your arms around their waist. Make a fist with one hand and place it just above their navel. Grasp your fist with your other hand and press into their abdomen with quick upward thrusts.",
          important: true
        },
        {
          title: "Continue Until Object Is Expelled",
          description: "Repeat abdominal thrusts until the object is expelled or the person loses consciousness."
        },
        {
          title: "If the Person Becomes Unconscious",
          description: "Lower the person carefully to the ground and begin CPR, starting with chest compressions. Before giving breaths, look in the mouth for the object. If you see it, remove it, but never perform blind finger sweeps."
        }
      ],
      warnings: [
        "For pregnant women or obese individuals, perform chest thrusts instead of abdominal thrusts.",
        "Do not perform abdominal thrusts on infants under 1 year of age.",
        "Even after successful removal of the obstruction, the person should seek medical attention."
      ],
      notes: [
        "For conscious infants: Hold the infant face down on your forearm, supporting their head, and deliver five back blows between the shoulder blades, then turn them over and give five chest thrusts.",
        "For self-treatment: Press your own abdomen against a firm object such as the back of a chair."
      ]
    },
    "bleeding": {
      id: "bleeding",
      title: "Severe Bleeding",
      description: "Protocol for controlling severe bleeding and preventing shock.",
      steps: [
        {
          title: "Ensure Safety",
          description: "Make sure the scene is safe and use personal protective equipment if available (gloves, eye protection)."
        },
        {
          title: "Call for Help",
          description: "Call emergency services (103 in Mongolia) or have someone else call immediately.",
          important: true
        },
        {
          title: "Apply Direct Pressure",
          description: "Use a clean cloth, gauze pad, or even clothing. Press firmly on the wound. If blood soaks through, add more material without removing the first layer.",
          important: true
        },
        {
          title: "Elevate the Wound",
          description: "If possible, raise the injured area above the level of the heart to help reduce blood flow."
        },
        {
          title: "Apply Tourniquet as Last Resort",
          description: "If bleeding cannot be controlled with direct pressure, and the injury is on an arm or leg, apply a tourniquet between the wound and the heart, 2-3 inches from the wound. Note the time it was applied."
        },
        {
          title: "Keep the Person Warm",
          description: "Cover them with a blanket or coat to prevent shock."
        },
        {
          title: "Watch for Signs of Shock",
          description: "Monitor for pale skin, rapid breathing, rapid pulse, nausea, or thirst."
        }
      ],
      warnings: [
        "Never remove an embedded object from a wound - stabilize it in place and seek immediate medical help.",
        "Only use a tourniquet if direct pressure fails and the bleeding is life-threatening.",
        "Once applied, a tourniquet should only be removed by medical professionals."
      ],
      notes: [
        "For wound with embedded objects: Apply pressure around the object, not directly on it.",
        "For neck wounds: Apply pressure with your fingers rather than the palm of your hand to avoid restricting breathing."
      ]
    },
    "burns": {
      id: "burns",
      title: "Burn Treatment",
      description: "First aid for different types and degrees of burns.",
      steps: [
        {
          title: "Ensure Safety",
          description: "Remove the person from the source of the burn. In case of fire, remember to 'stop, drop, and roll'. For electrical burns, make sure the power source is off before touching the victim."
        },
        {
          title: "Determine Burn Severity",
          description: "First-degree burns: Redness, minor swelling, pain (like sunburn). Second-degree burns: Blisters, severe redness, pain. Third-degree burns: White or charred appearance, possible lack of pain due to nerve damage.",
          important: true
        },
        {
          title: "Call for Emergency Help",
          description: "For chemical burns, large burns, third-degree burns, burns on the face/hands/feet/genitals, or if the victim is very young or elderly, call emergency services (103 in Mongolia) immediately.",
          important: true
        },
        {
          title: "Cool the Burn",
          description: "For first and second-degree burns, run cool (not cold) water over the area for 10-15 minutes. Do NOT use ice, as this can further damage the tissue."
        },
        {
          title: "Remove Constrictive Items",
          description: "Carefully remove rings, watches, belts, or tight clothing from the burned area before swelling occurs."
        },
        {
          title: "Apply Appropriate Covering",
          description: "Once cooled, cover the burn with a sterile, non-stick bandage or clean cloth. Do not apply fluffy cotton or materials that may shed fibers and stick to the burn."
        },
        {
          title: "Manage Pain",
          description: "Over-the-counter pain relievers like ibuprofen or acetaminophen can help reduce pain and inflammation."
        },
        {
          title: "Monitor for Infection",
          description: "Watch for signs of infection such as increased pain, redness, swelling, oozing, or fever."
        }
      ],
      warnings: [
        "Do NOT apply butter, oil, ice, or cotton balls to burns.",
        "Do NOT break blisters, as this increases risk of infection.",
        "Do NOT use cold water or ice for large burns, as this can cause hypothermia.",
        "Chemical burns require continuous water flushing for at least 20 minutes."
      ],
      notes: [
        "For chemical burns: Remove contaminated clothing and flush with running water for at least 20 minutes.",
        "For electrical burns: Check for entry and exit wounds, as internal damage may be worse than visible burns.",
        "For sunburn: Apply aloe vera gel and drink extra water to prevent dehydration.",
        "Minor first-degree burns typically heal within a week without medical treatment."
      ]
    },
    "heart-attack": {
      id: "heart-attack",
      title: "Heart Attack",
      description: "Recognizing symptoms and emergency response for heart attack.",
      steps: [
        {
          title: "Recognize the Symptoms",
          description: "Common signs include chest pain/pressure (may feel like squeezing), pain radiating to the jaw/neck/back/arms, shortness of breath, cold sweat, nausea, lightheadedness. Women may experience different symptoms including unusual fatigue, pressure in the lower chest, upper back pain.",
          important: true
        },
        {
          title: "Call Emergency Services",
          description: "Call 103 (Mongolia) immediately, even if you're not completely sure it's a heart attack. Don't wait to see if symptoms improve.",
          important: true
        },
        {
          title: "Have the Person Rest",
          description: "Help them into a comfortable position, typically sitting upright which helps with breathing. Loosen tight clothing."
        },
        {
          title: "Administer Aspirin",
          description: "If the person is not allergic to aspirin, have them chew one adult aspirin (325 mg) or 4 low-dose (81 mg) aspirins. Chewing gets the medicine into the bloodstream faster than swallowing."
        },
        {
          title: "Administer Nitroglycerin",
          description: "If prescribed, help the person take their nitroglycerin as directed."
        },
        {
          title: "Monitor and Be Ready for CPR",
          description: "If the person becomes unresponsive and stops breathing normally, begin CPR immediately if you're trained."
        },
        {
          title: "Use AED If Available",
          description: "If an automated external defibrillator (AED) is available and the person is unresponsive, use it following the device instructions."
        }
      ],
      warnings: [
        "Do not allow the person to deny symptoms or refuse emergency help.",
        "Do not leave the person alone except to call for help.",
        "Do not wait to see if symptoms resolve on their own."
      ],
      notes: [
        "Time is critical during a heart attack - every minute matters.",
        "Heart attack symptoms can be different for women, often more subtle and may not include chest pain.",
        "Risk factors include: high blood pressure, high cholesterol, smoking, diabetes, family history, age, and obesity."
      ]
    },
    "stroke": {
      id: "stroke",
      title: "Stroke Response",
      description: "FAST protocol and emergency care for stroke victims.",
      steps: [
        {
          title: "Recognize the Symptoms Using FAST",
          description: "Face: Ask the person to smile. Does one side of the face droop? Arms: Ask the person to raise both arms. Does one arm drift downward? Speech: Ask the person to repeat a simple phrase. Is their speech slurred or strange? Time: If you observe any of these signs, call emergency services immediately. Note the time when symptoms first appeared.",
          important: true
        },
        {
          title: "Call Emergency Services",
          description: "Call 103 (Mongolia) immediately. Mention that you suspect a stroke so that appropriate medical care can be dispatched.",
          important: true
        },
        {
          title: "Note the Time Symptoms Started",
          description: "This is critical information for medical professionals as some stroke treatments must be administered within a specific time window from symptom onset."
        },
        {
          title: "Position the Person",
          description: "Help them lie down with their head slightly elevated if possible. If they're unconscious but breathing, place them in the recovery position (on their side)."
        },
        {
          title: "Check Vital Signs",
          description: "Monitor breathing and pulse. Be prepared to begin CPR if the person becomes unresponsive and stops breathing normally."
        },
        {
          title: "Do Not Give Food or Drink",
          description: "The person may have difficulty swallowing and could choke."
        },
        {
          title: "Keep the Person Calm",
          description: "Provide reassurance while waiting for emergency services to arrive."
        },
        {
          title: "Administer Medication Only If Directed",
          description: "Do not give aspirin or other medications unless specifically directed by medical professionals. Unlike heart attacks, aspirin may be harmful for certain types of strokes."
        }
      ],
      warnings: [
        "Do not give food, drink, or medication unless directed by emergency medical personnel.",
        "Do not attempt to drive the person to the hospital yourself - call an ambulance.",
        "Do not delay seeking help - time is brain function in stroke cases."
      ],
      notes: [
        "There are two main types of stroke: ischemic (caused by a blood clot) and hemorrhagic (caused by bleeding in the brain).",
        "Additional signs of stroke may include sudden severe headache, vision problems, dizziness, confusion, or trouble walking.",
        "Risk factors include high blood pressure, smoking, diabetes, high cholesterol, heart disease, family history, and age."
      ]
    },
    "seizure": {
      id: "seizure",
      title: "Seizure Management",
      description: "Proper care during and after seizures and when to seek emergency help.",
      steps: [
        {
          title: "Stay Calm and Time the Seizure",
          description: "Note when the seizure begins and how long it lasts. Most seizures stop on their own within a few minutes."
        },
        {
          title: "Ensure Safety",
          description: "Clear the area of anything that could cause injury. If possible, help ease the person to the floor or ground.",
          important: true
        },
        {
          title: "Protect the Head",
          description: "Place something soft and flat, like a folded jacket, under their head. Remove eyeglasses and loosen tight clothing around the neck."
        },
        {
          title: "Position the Person",
          description: "If possible, gently roll the person onto their side to prevent choking, unless moving them would cause injury."
        },
        {
          title: "Never Restrain the Person",
          description: "Do not hold the person down or restrict their movements. Do not put anything in their mouth.",
          important: true
        },
        {
          title: "Call Emergency Services If",
          description: "The seizure lasts longer than 5 minutes, the person does not wake up after the seizure stops, the person has another seizure shortly after the first, the person is injured during the seizure, the person has difficulty breathing after the seizure, the seizure happens in water, or the person is pregnant or has diabetes.",
          important: true
        },
        {
          title: "After the Seizure",
          description: "Check for breathing and stay with them until they are fully conscious and aware of their surroundings. They may be confused or tired."
        },
        {
          title: "Document the Event",
          description: "Record details about the seizure, including how long it lasted, what parts of the body were affected, and any unusual behaviors before or after, to share with medical professionals."
        }
      ],
      warnings: [
        "Never put anything in the person's mouth during a seizure - it could injure their teeth or jaw.",
        "Do not try to stop or restrain their movements.",
        "Do not offer food, drink, or medication until the person is fully conscious and able to swallow safely."
      ],
      notes: [
        "Not all seizures involve convulsions. Some may cause staring spells, unusual movements, or changes in awareness.",
        "If the person has epilepsy and this is a typical seizure for them, emergency services may not be needed unless the seizure meets the conditions mentioned above.",
        "The recovery period after a seizure (postictal phase) can last minutes to hours and may involve confusion, fatigue, headache, or muscle soreness."
      ]
    },
    "hypothermia": {
      id: "hypothermia",
      title: "Hypothermia & Frostbite",
      description: "Identifying and treating cold-related emergencies and preventing further injury.",
      steps: [
        {
          title: "Recognize Hypothermia Symptoms",
          description: "Watch for shivering, confusion, slurred speech, drowsiness, weak pulse, slow breathing, loss of coordination, or a body temperature below 35°C (95°F).",
          important: true
        },
        {
          title: "Call Emergency Services",
          description: "For moderate to severe hypothermia (strong shivering, confusion, or loss of consciousness), call 103 (Mongolia) immediately.",
          important: true
        },
        {
          title: "Move to Warm Area",
          description: "Gently move the person to a warm, dry location and shield them from wind and cold. Handle them gently and minimize movement."
        },
        {
          title: "Remove Wet Clothing",
          description: "Replace wet clothes with dry, warm blankets or clothing. Cover their head and neck."
        },
        {
          title: "Apply Passive Warming",
          description: "For mild hypothermia, use skin-to-skin contact by placing the person's bare chest against yours and covering both with blankets. For all cases, apply warm (not hot) blankets or clothing to the neck, chest, abdomen, and groin. Do not attempt to warm the limbs first."
        },
        {
          title: "Provide Warm Beverages If Alert",
          description: "If the person is fully conscious and able to swallow normally, give them warm, sweet, non-alcoholic beverages."
        },
        {
          title: "Monitor Breathing",
          description: "Check breathing continuously. If breathing stops or seems dangerously slow or shallow, begin CPR if trained."
        },
        {
          title: "Treat Frostbite If Present",
          description: "For frostbitten areas (pale, cold, numb skin on extremities), immerse in warm (not hot) water (38-42°C or 100-108°F) until skin appears red and warm. Do not rub the affected areas or use dry heat like heaters. Seek medical attention as soon as possible."
        }
      ],
      warnings: [
        "Never give alcohol to a person with hypothermia as it can worsen the condition.",
        "Don't apply direct heat (heating pad, hot water, fire) to a hypothermic person as it can damage the skin or cause irregular heartbeats.",
        "Do not attempt to rewarm a severely hypothermic person (unconscious) in the field - focus on preventing further heat loss and seeking emergency care.",
        "Never rub frostbitten areas as this can cause more tissue damage."
      ],
      notes: [
        "Older adults, young children, and people with certain medical conditions are especially vulnerable to hypothermia.",
        "Hypothermia can occur at temperatures above freezing (10°C/50°F) when a person is wet or exposed to wind.",
        "After rewarming frostbitten areas, they may turn mottled blue or purple with blisters - this is normal but requires medical attention.",
        "In Mongolia, winter temperatures can drop extremely low, making hypothermia a significant risk."
      ]
    },
    "anaphylaxis": {
      id: "anaphylaxis",
      title: "Anaphylactic Shock",
      description: "Responding to severe allergic reactions and using epinephrine auto-injectors.",
      steps: [
        {
          title: "Recognize Anaphylaxis Symptoms",
          description: "Watch for hives/rash, swelling of face/lips/throat, difficulty breathing, wheezing, persistent cough, tightness in throat, hoarse voice, nausea/vomiting, abdominal pain, dizziness, rapid heartbeat, or loss of consciousness. Symptoms usually appear within minutes to 2 hours after exposure to an allergen.",
          important: true
        },
        {
          title: "Call Emergency Services",
          description: "Call 103 (Mongolia) immediately. Anaphylaxis is life-threatening and requires emergency medical care.",
          important: true
        },
        {
          title: "Administer Epinephrine If Available",
          description: "If the person has an epinephrine auto-injector (EpiPen, Auvi-Q, etc.), help them use it or administer it yourself if they cannot. Inject into the middle of the outer thigh and hold for 3 seconds. The injection can be done through clothing if necessary.",
          important: true
        },
        {
          title: "Position the Person",
          description: "Have them lie flat on their back with legs elevated, unless they are having trouble breathing, in which case have them sit up. If they are vomiting or unconscious, place them on their side in the recovery position."
        },
        {
          title: "Remove the Allergen If Possible",
          description: "If the reaction is from a bee sting, remove the stinger by scraping it with a card (don't use tweezers). If it's from food or medication, stop consumption immediately."
        },
        {
          title: "Administer Second Dose If Needed",
          description: "If symptoms don't improve within 5-15 minutes after the first dose of epinephrine and emergency responders haven't arrived, administer a second dose if available."
        },
        {
          title: "Provide CPR If Necessary",
          description: "If the person becomes unresponsive and stops breathing normally, begin CPR if you're trained."
        },
        {
          title: "Report to Emergency Responders",
          description: "Tell emergency responders about the allergic reaction, any known allergens, symptoms observed, and any medications administered (including the time of administration)."
        }
      ],
      warnings: [
        "Never delay administering epinephrine or calling emergency services if anaphylaxis is suspected.",
        "Do not have the person stand or walk, even if they appear to be recovering.",
        "Don't give oral medications for an allergic reaction if the person is having difficulty breathing or swallowing."
      ],
      notes: [
        "Common triggers for anaphylaxis include foods (especially nuts, shellfish, milk, eggs), medications, insect stings, and latex.",
        "Epinephrine auto-injectors should be stored at room temperature and checked regularly for expiration.",
        "After an anaphylactic reaction, the person should be monitored at a medical facility for at least 4-6 hours, as symptoms can return after the epinephrine wears off."
      ]
    },
    "poisoning": {
      id: "poisoning",
      title: "Poisoning Response",
      description: "First aid for different types of poisoning including ingestion, inhalation, and skin contact.",
      steps: [
        {
          title: "Ensure Safety",
          description: "Make sure you're not at risk of exposure to the poison. For inhalation poisoning, move to fresh air. For chemical exposure, wear gloves if possible.",
          important: true
        },
        {
          title: "Call for Help",
          description: "Call emergency services (103 in Mongolia) or the poison control center immediately. Be ready to provide information about the poison, amount, when it was ingested/exposed to, and the person's symptoms.",
          important: true
        },
        {
          title: "For Ingested Poisons",
          description: "Do not induce vomiting unless specifically instructed by medical professionals. Do not give anything to drink unless advised. If the person vomits, save some of it in a container for identification if possible."
        },
        {
          title: "For Inhaled Poisons",
          description: "Get the person to fresh air immediately. Open doors and windows for ventilation. If safe to do so, prevent fumes from spreading to other rooms."
        },
        {
          title: "For Skin Contact with Poisons",
          description: "Remove contaminated clothing using gloves. Rinse the skin thoroughly with running water for 15-20 minutes. For chemical burns, continue rinsing until emergency help arrives."
        },
        {
          title: "For Eye Contact with Poisons",
          description: "Flush the eye with clean, lukewarm water for 15-20 minutes. Hold the eye under running water or pour water into the eye from a clean container. Keep the affected eye lower than the unaffected eye to prevent contamination."
        },
        {
          title: "Monitor Vital Signs",
          description: "Check breathing and pulse. If the person becomes unresponsive and stops breathing normally, begin CPR if you're trained."
        },
        {
          title: "Save Containers or Evidence",
          description: "Keep the poison container, plant, medicine bottle, or other evidence for identification by medical professionals."
        }
      ],
      warnings: [
        "Never induce vomiting or give antidotes unless directed by medical professionals.",
        "Never try to neutralize a poison with lemon juice, vinegar, or other substances.",
        "Do not waste time looking for antidotes - call for help immediately."
      ],
      notes: [
        "Carbon monoxide poisoning is especially dangerous because it is colorless and odorless. Symptoms include headache, dizziness, weakness, nausea, and confusion.",
        "Food poisoning symptoms usually appear 2-6 hours after eating contaminated food and include nausea, vomiting, diarrhea, and abdominal cramps.",
        "Keep all household chemicals, medications, and potentially poisonous plants out of reach of children.",
        "In Mongolia, always be cautious with home heating systems during winter to prevent carbon monoxide poisoning."
      ]
    },
    "fracture": {
      id: "fracture",
      title: "Fracture & Dislocation",
      description: "Handling bone fractures and joint dislocations safely.",
      steps: [
        {
          title: "Recognize Signs of Fracture",
          description: "Look for pain, swelling, bruising, deformity, inability to move the injured part, or a grating sensation when the injured area is moved. Open fractures (where bone has broken through skin) will be visible.",
          important: true
        },
        {
          title: "Call Emergency Services",
          description: "For severe fractures, open fractures, spinal injuries, or head injuries, call 103 (Mongolia) immediately.",
          important: true
        },
        {
          title: "Immobilize the Injury",
          description: "Do not move the injured area unless absolutely necessary. Support the injury in the position found with soft padding. Do not attempt to straighten or realign a fracture or dislocation.",
          important: true
        },
        {
          title: "Control Bleeding if Present",
          description: "For open fractures, apply gentle pressure around the wound with a clean cloth. Do not push bone fragments back in or apply pressure directly on the bone."
        },
        {
          title: "Apply Ice",
          description: "If available, apply ice wrapped in a thin cloth or towel to the area to reduce swelling and pain. Do not apply ice directly to the skin or for longer than 20 minutes at a time."
        },
        {
          title: "Improvise a Splint if Necessary",
          description: "If medical help is delayed, you can splint the injury to prevent movement. Use rigid items (boards, rolled-up magazines) on either side of the injury, padding with soft material, and secure with bandages or cloth. The splint should immobilize the joints above and below the fracture."
        },
        {
          title: "Elevate the Injured Area",
          description: "If possible and if it doesn't cause pain, elevate the injured limb above heart level to reduce swelling."
        },
        {
          title: "Monitor for Shock",
          description: "Watch for signs of shock such as pale skin, rapid breathing, rapid pulse, or dizziness. If shock develops, have the person lie flat, keep them warm, and elevate their legs if no spinal or leg injury is suspected."
        }
      ],
      warnings: [
        "Never attempt to push a protruding bone back into place.",
        "Never attempt to 'set' or 'straighten' a fracture or dislocation.",
        "Never move a person with a suspected spinal, neck, or head injury unless absolutely necessary for safety.",
        "If a joint is dislocated, do not attempt to relocate it - this requires professional medical care."
      ],
      notes: [
        "For suspected fractures of the head, neck, or spine, minimize movement and wait for emergency services.",
        "Fractures in older adults and young children should always be evaluated by a medical professional, even if they seem minor.",
        "Sprains may have similar symptoms to fractures. When in doubt, treat as a fracture until medical evaluation.",
        "In rural areas of Mongolia, where medical help may be delayed, proper immobilization is especially important during transport."
      ]
    },
    "drowning": {
      id: "drowning",
      title: "Drowning Response",
      description: "Rescue techniques and emergency care for drowning victims.",
      steps: [
        {
          title: "Ensure Safety First",
          description: "Do not put yourself at risk when attempting a rescue. Use a reaching object (pole, branch, rope) or throw something that floats to the person rather than entering the water if possible.",
          important: true
        },
        {
          title: "Remove from Water",
          description: "Get the person out of the water as quickly and safely as possible. If spinal injury is suspected (diving accident), stabilize the neck and back while removing them."
        },
        {
          title: "Call Emergency Services",
          description: "Call 103 (Mongolia) immediately, even if the person seems fine. Complications can develop later.",
          important: true
        },
        {
          title: "Check Breathing and Circulation",
          description: "Check if the person is breathing. If not, begin CPR immediately, starting with rescue breaths if you are trained. If the person is breathing, place them in the recovery position (on their side)."
        },
        {
          title: "Begin CPR if Needed",
          description: "If the person is not breathing, begin CPR with 5 initial rescue breaths, then continue with standard CPR (30 chest compressions followed by 2 rescue breaths). Continue until help arrives or the person starts breathing.",
          important: true
        },
        {
          title: "Keep the Person Warm",
          description: "Remove wet clothing if possible and replace with dry blankets or clothing. Shield from wind and cold."
        },
        {
          title: "Do Not Give Food or Drink",
          description: "Even if conscious, the person should not eat or drink until medically cleared."
        },
        {
          title: "Monitor Closely",
          description: "Even if the person seems to recover, they should be evaluated by medical professionals. Watch for breathing difficulties, unusual behavior, extreme fatigue, or coughing."
        }
      ],
      warnings: [
        "Never place yourself at risk when attempting a water rescue without proper training and equipment.",
        "Do not waste time trying to drain water from the lungs before starting rescue breaths and CPR.",
        "Do not attempt to warm the person with hot water or direct heat, which can worsen the situation.",
        "Even if the person seems fine, they should still be evaluated by medical professionals - delayed drowning can occur hours later."
      ],
      notes: [
        "Drowning occurs very quickly and often silently - constant supervision of children around water is essential.",
        "Cold water drowning victims have a better chance of successful resuscitation, even after longer periods underwater.",
        "Secondary drowning can occur up to 24-48 hours after a water incident - seek medical care for anyone who has had a submersion event, even if they seem fine initially.",
        "In Mongolia, be especially cautious around frozen lakes and rivers during winter, as ice may be thin and treacherous."
      ]
    },
    "head-injury": {
      id: "head-injury",
      title: "Head Injury & Concussion",
      description: "Assessment and management of traumatic head injuries and concussion protocol.",
      steps: [
        {
          title: "Assess Responsiveness",
          description: "Determine if the person is conscious. If unconscious, check for breathing and pulse.",
          important: true
        },
        {
          title: "Call Emergency Services",
          description: "For any significant head injury, especially if the person is unconscious (even briefly), confused, vomiting, having seizures, or showing unequal pupils, call 103 (Mongolia) immediately.",
          important: true
        },
        {
          title: "Stabilize the Head and Neck",
          description: "If you suspect a spinal injury, minimize movement of the head and neck. Hold the head in the position found until emergency help arrives.",
          important: true
        },
        {
          title: "Check for Clear Fluid or Blood",
          description: "Look for clear fluid or blood coming from the ears or nose, which may indicate a skull fracture. Do not stop the flow, but loosely cover with a clean pad."
        },
        {
          title: "Apply Cold Compress for Swelling",
          description: "For minor bumps and bruises without open wounds, apply a cold compress wrapped in a cloth to reduce swelling. Do not apply pressure to a suspected skull fracture."
        },
        {
          title: "Monitor for Signs of Concussion",
          description: "Watch for symptoms such as confusion, memory problems, headache, dizziness, nausea/vomiting, slurred speech, blurred vision, sensitivity to light/noise, or mood changes. Symptoms may appear immediately or develop over hours or days."
        },
        {
          title: "Keep the Person Awake if Drowsy",
          description: "If the person is drowsy but awake, keep them awake while waiting for emergency services. Ask simple questions to assess their mental status."
        },
        {
          title: "Position Properly if Vomiting",
          description: "If the person is vomiting and lying down, gently roll them onto their side while supporting their head and neck to prevent choking."
        }
      ],
      warnings: [
        "Do not remove objects that have penetrated the head or skull.",
        "Do not shake a person with a suspected head injury to wake them up.",
        "Do not give medications, food, or drinks until medically cleared, especially if surgery might be needed.",
        "Do not let a person with a significant head injury drive or be alone for the first 24 hours."
      ],
      notes: [
        "Concussion is a mild traumatic brain injury that should be taken seriously even if there is no visible injury.",
        "Anyone with a concussion should be evaluated by a healthcare provider and follow a gradual return-to-activity protocol.",
        "Repeated concussions, especially before complete recovery from a previous one, can cause severe long-term damage.",
        "Look for warning signs requiring immediate attention: worsening headache, repeated vomiting, increasing confusion, slurred speech, seizures, numbness, or unusual behavior."
      ]
    },
    "diabetic": {
      id: "diabetic",
      title: "Diabetic Emergencies",
      description: "Managing hypoglycemia, hyperglycemia, and diabetic ketoacidosis emergencies.",
      steps: [
        {
          title: "Recognize Type of Emergency",
          description: "Hypoglycemia (low blood sugar): sudden onset, confusion, shakiness, sweating, hunger, irritability, pale skin, heart racing, weakness, anxiety. Hyperglycemia (high blood sugar): develops over hours/days, extreme thirst, frequent urination, fatigue, dry mouth, blurred vision, fruity breath odor (ketoacidosis).",
          important: true
        },
        {
          title: "Check Blood Glucose If Possible",
          description: "If a blood glucose meter is available and the person or someone present knows how to use it, check the blood sugar level to confirm the condition."
        },
        {
          title: "For Hypoglycemia (Low Blood Sugar)",
          description: "If the person is conscious and able to swallow, give 15-20 grams of fast-acting carbohydrates: 4 glucose tablets, 1/2 cup fruit juice or regular soda, 1 tablespoon honey or syrup, or several pieces of hard candy. Wait 15 minutes and recheck blood sugar if possible. Repeat treatment if blood sugar remains low.",
          important: true
        },
        {
          title: "For Severe Hypoglycemia",
          description: "If the person is unconscious or unable to swallow safely, do not give anything by mouth. Call emergency services (103 in Mongolia) immediately. If available and you are trained, administer glucagon as directed in their emergency kit."
        },
        {
          title: "For Hyperglycemia (High Blood Sugar)",
          description: "Have the person drink water (if conscious and not nauseated) to prevent dehydration. Do not attempt to administer insulin unless you are the person's caregiver and have clear instructions."
        },
        {
          title: "Call Emergency Services",
          description: "Call 103 (Mongolia) immediately if: the person is unconscious or extremely disoriented, unable to eat or drink, has severe symptoms, blood sugar remains extremely high, ketoacidosis is suspected (fruity breath odor), or condition doesn't improve quickly with treatment.",
          important: true
        },
        {
          title: "Position the Person",
          description: "If unconscious but breathing, place in the recovery position (on their side). If not breathing normally, begin CPR if trained."
        },
        {
          title: "Document and Communicate",
          description: "Note the time and type of symptoms, treatments given, and any blood sugar readings to report to emergency responders."
        }
      ],
      warnings: [
        "Never give food or drink to someone who is unconscious or unable to swallow safely.",
        "Do not attempt to give insulin to someone with low blood sugar - this will make the situation worse.",
        "Do not exercise or leave alone a person experiencing a diabetic emergency.",
        "If unsure whether blood sugar is high or low, treat for low blood sugar first, as this is more immediately dangerous."
      ],
      notes: [
        "The person may have a medical ID bracelet, necklace, or card indicating they have diabetes.",
        "Many people with diabetes carry glucose tablets, gel, or other emergency sugar sources.",
        "Diabetic ketoacidosis (DKA) is a life-threatening condition, usually developing in type 1 diabetes, requiring immediate medical care.",
        "Hypoglycemia can sometimes resemble intoxication or stroke - check for medical ID if you encounter a disoriented person."
      ]
    },
    "chest-pain": {
      id: "chest-pain",
      title: "Chest Pain Assessment",
      description: "Evaluating chest pain and determining appropriate emergency response.",
      steps: [
        {
          title: "Recognize Warning Signs",
          description: "Chest pain requiring immediate attention often: feels like pressure, squeezing, fullness, or pain in the center or left side of chest; lasts more than a few minutes or goes away and returns; may radiate to jaw, shoulders, arms (especially left), back, or abdomen; often accompanied by shortness of breath, cold sweat, nausea, lightheadedness.",
          important: true
        },
        {
          title: "Call Emergency Services",
          description: "If chest pain is severe, sudden, crushing, or accompanied by other concerning symptoms, call 103 (Mongolia) immediately. Do not delay to see if it improves.",
          important: true
        },
        {
          title: "Position for Comfort",
          description: "Help the person into a position that makes breathing easier, usually sitting upright and leaning slightly forward. Loosen tight clothing around the neck and waist."
        },
        {
          title: "Administer Aspirin If Appropriate",
          description: "If the person is not allergic to aspirin and heart attack is suspected, have them chew one adult aspirin (325 mg) or 4 low-dose (81 mg) aspirins. Do not give aspirin if the pain is clearly not heart-related or if the person is bleeding or on blood thinners."
        },
        {
          title: "Assist with Medication",
          description: "If the person has been prescribed nitroglycerin for heart-related chest pain, help them take it as directed."
        },
        {
          title: "Monitor and Document",
          description: "Note when the pain started, its intensity, location, what makes it better or worse, and other symptoms. Watch for changes in breathing, skin color, level of consciousness."
        },
        {
          title: "Begin CPR If Necessary",
          description: "If the person becomes unresponsive and is not breathing normally, begin CPR immediately if you're trained. If available, use an AED (automated external defibrillator) following the device instructions."
        },
        {
          title: "Provide Reassurance",
          description: "Remain calm and reassuring. Anxiety can worsen chest pain and cardiac symptoms."
        }
      ],
      warnings: [
        "Never ignore chest pain, especially if it's new, unexplained, or accompanied by other symptoms like shortness of breath or nausea.",
        "Do not allow the person to drive themselves to the hospital.",
        "Do not dismiss chest pain as indigestion or muscle pain without proper medical evaluation, especially in those with heart disease risk factors.",
        "Women, elderly people, and those with diabetes may have atypical symptoms of heart attack, such as fatigue, shortness of breath, or upper back pain without prominent chest pain."
      ],
      notes: [
        "Not all chest pain is related to the heart. It can be caused by lung problems, digestive issues, musculoskeletal pain, or anxiety.",
        "However, it's impossible to reliably distinguish heart-related from non-heart-related chest pain without proper medical testing.",
        "Risk factors for heart attack include age, smoking, high blood pressure, high cholesterol, diabetes, family history, and previous heart problems.",
        "Time is critical in treating heart attacks - the sooner treatment begins, the better the outcome."
      ]
    },
    "bites": {
      id: "bites",
      title: "Animal & Insect Bites",
      description: "Treatment for bites and stings from animals, insects, and venomous creatures.",
      steps: [
        {
          title: "Ensure Safety",
          description: "Move to a safe location away from the animal or insect to prevent additional bites or stings.",
          important: true
        },
        {
          title: "Assess the Bite/Sting",
          description: "Determine what type of creature caused the bite or sting. For venomous snake bites, try to identify the snake if safe to do so (take a photo from a distance), but do not chase or try to capture it."
        },
        {
          title: "Call Emergency Services",
          description: "Call 103 (Mongolia) immediately for: venomous snake bites, multiple bee/wasp stings, bites to the face/neck, large or deep animal bites, signs of severe allergic reaction (difficulty breathing, swelling of face/throat, dizziness), or if the bite is from a wild or unknown animal.",
          important: true
        },
        {
          title: "For Snake Bites",
          description: "Keep the bitten area below heart level if possible. Remove any jewelry or tight items near the bite site before swelling occurs. Immobilize the affected limb. Do NOT apply a tourniquet, cut the wound, suck out venom, apply ice, or give the person alcohol or pain medication unless directed by medical professionals.",
          important: true
        },
        {
          title: "For Insect Stings",
          description: "For bee stings, remove the stinger by scraping it with a card edge (don't use tweezers or squeeze). For all stings, wash the area with soap and water, apply a cold compress to reduce pain and swelling."
        },
        {
          title: "For Animal Bites",
          description: "For minor wounds, wash thoroughly with soap and water for 5 minutes. Apply gentle pressure with a clean cloth to stop bleeding. For deep wounds or punctures, clean the surface gently and seek medical care."
        },
        {
          title: "Watch for Allergic Reactions",
          description: "Monitor for signs of severe allergic reaction (anaphylaxis): difficulty breathing, hives or rash, swelling of face/throat/tongue, rapid pulse, dizziness, nausea. If these occur, use an epinephrine auto-injector if available and call emergency services."
        },
        {
          title: "Care for the Wound",
          description: "Once bleeding is controlled, apply antibiotic ointment and cover with a sterile bandage. Change the bandage daily and monitor for signs of infection (increased pain, redness, swelling, warmth, pus, or red streaks extending from the wound)."
        }
      ],
      warnings: [
        "Never attempt to handle, capture, or kill the animal that bit you or someone else.",
        "Do not ignore any animal bite, especially from wild animals or unknown dogs/cats, as they carry risk of rabies.",
        "Never apply a tourniquet for a snake bite - this can cause more harm than good.",
        "Do not apply suction, ice, or heat to a snake bite, or cut the wound."
      ],
      notes: [
        "In Mongolia, venomous snakes are rare but do exist. Most dangerous are the Halys pit viper and Central Asian cobra.",
        "Rabies is fatal once symptoms appear, but preventable with prompt post-exposure treatment.",
        "All mammal bites (especially dog, cat, bat, and wild animal bites) should be evaluated by a healthcare provider for rabies risk.",
        "Tick removal should be done carefully with tweezers, grasping as close to the skin as possible and pulling straight out. Never twist or crush the tick."
      ]
    }
  };

  // First check if we have detailed data for this protocol
  if (id in protocolData) {
    return protocolData[id];
  }

  // If not, look in the basic protocols list
  const basicProtocol = emergencyProtocols.find(p => p.id === id);
  if (basicProtocol) {
    // Return with empty steps array
    return {
      ...basicProtocol,
      steps: [{
        title: "Coming Soon",
        description: "Detailed steps for this protocol are being developed."
      }]
    };
  }

  return null;
};

export default function ProtocolDetail() {
  const { t } = useTranslation();
  const { id } = useParams<{ id: string }>();
  const [protocol, setProtocol] = useState<Protocol | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const protocolData = getProtocolById(id);
      setProtocol(protocolData);
      setLoading(false);
    }
  }, [id]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (!protocol) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-10">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">{t('protocols.notFound', 'Protocol Not Found')}</h1>
          <p className="text-gray-600 mb-6">{t('protocols.notFoundDesc', 'The emergency protocol you\'re looking for doesn\'t exist.')}</p>
          <Link href="/emergency">
            <a className="bg-primary text-white px-6 py-2 rounded-md inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>{t('protocols.backToAll', 'Back to All Protocols')}</span>
            </a>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <Link href="/emergency">
          <a className="text-[#004A9F] hover:text-[#0064D6] inline-flex items-center mb-4">
            <ArrowLeft className="w-4 h-4 mr-1" />
            <span>{t('protocols.viewAll')}</span>
          </a>
        </Link>
        <h1 className="text-3xl font-bold text-[#004A9F]">{protocol.title}</h1>
        <p className="text-gray-600 mt-2">{protocol.description}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button 
          onClick={handlePrint}
          className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md inline-flex items-center text-sm"
        >
          <Printer className="w-4 h-4 mr-2" />
          <span>{t('protocols.print', 'Print')}</span>
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md inline-flex items-center text-sm">
          <Share2 className="w-4 h-4 mr-2" />
          <span>{t('protocols.share', 'Share')}</span>
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md inline-flex items-center text-sm">
          <Bookmark className="w-4 h-4 mr-2" />
          <span>{t('protocols.save', 'Save')}</span>
        </button>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-primary text-white px-6 py-3">
          <h2 className="font-semibold">{t('protocols.stepByStep', 'Step-by-Step Instructions')}</h2>
        </div>
        <div className="p-6">
          <ol className="space-y-6">
            {protocol.steps.map((step, index) => (
              <li key={index} className="relative pl-8">
                <div className="absolute left-0 top-0 w-6 h-6 rounded-full bg-[#004A9F] text-white flex items-center justify-center font-medium text-sm">
                  {index + 1}
                </div>
                <h3 className={`font-medium text-lg mb-1 ${step.important ? 'text-primary' : 'text-gray-800'}`}>
                  {step.title}
                  {step.important && (
                    <span className="ml-2 inline-flex items-center text-primary">
                      <AlertTriangle className="w-4 h-4" />
                    </span>
                  )}
                </h3>
                <p className="text-gray-600">{step.description}</p>
              </li>
            ))}
          </ol>
        </div>
      </div>

      {/* Warnings */}
      {protocol.warnings && protocol.warnings.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
          <div className="bg-red-600 text-white px-6 py-3">
            <h2 className="font-semibold">{t('protocols.warnings', 'Important Warnings')}</h2>
          </div>
          <div className="p-6">
            <ul className="list-disc pl-5 space-y-2">
              {protocol.warnings.map((warning, index) => (
                <li key={index} className="text-gray-700">{warning}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Notes */}
      {protocol.notes && protocol.notes.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="bg-gray-100 px-6 py-3">
            <h2 className="font-semibold text-gray-800">{t('protocols.additionalNotes', 'Additional Notes')}</h2>
          </div>
          <div className="p-6">
            <ul className="list-disc pl-5 space-y-2">
              {protocol.notes.map((note, index) => (
                <li key={index} className="text-gray-700">{note}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}