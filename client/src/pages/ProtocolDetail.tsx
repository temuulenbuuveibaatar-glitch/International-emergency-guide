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
      description: "Comprehensive treatment guide for different types and degrees of burns, including blister management.",
      steps: [
        {
          title: "Ensure Safety",
          description: "Remove the person from the source of the burn. In case of fire, remember to 'stop, drop, and roll'. For electrical burns, make sure the power source is off before touching the victim."
        },
        {
          title: "Determine Burn Severity",
          description: "First-degree burns: Redness, minor swelling, pain (like sunburn). Second-degree burns: Blisters, severe redness, pain, wet appearance. Third-degree burns: White, brown or charred appearance, leathery texture, possible lack of pain due to nerve damage.",
          important: true
        },
        {
          title: "Call for Emergency Help",
          description: "For chemical burns, large burns (larger than 3 inches), third-degree burns, burns on the face/hands/feet/genitals, burns that encircle a limb, or if the victim is very young or elderly, call emergency services (103 in Mongolia) immediately.",
          important: true
        },
        {
          title: "Cool the Burn",
          description: "For first and second-degree burns, run cool (not cold) water over the area for 10-15 minutes. Do NOT use ice, as this can further damage the tissue. After cooling, you can apply a cool, wet compress."
        },
        {
          title: "Remove Constrictive Items",
          description: "Carefully remove rings, watches, belts, or tight clothing from the burned area before swelling occurs. Never remove clothing that is stuck to the burn."
        },
        {
          title: "Blister Management",
          description: "Do not break or pop blisters, as they protect against infection. If blisters break on their own, clean the area gently with mild soap and water, apply an antibiotic ointment (like Bacitracin or Polysporin), and cover with a sterile bandage. Change the dressing daily and monitor closely for signs of infection.",
          important: true
        },
        {
          title: "Apply Appropriate Covering",
          description: "Once cooled, cover the burn with a sterile, non-stick bandage or clean cloth. For blistered burns, apply a thin layer of antibiotic ointment before bandaging. Use non-adhesive bandages or gauze secured with medical tape outside the wound area. Never use fluffy cotton or materials that may shed fibers and stick to the burn."
        },
        {
          title: "Burn Dressing Changes",
          description: "Change dressings daily or whenever they become wet or soiled. Gently wash the burn with mild soap and water before applying new dressing. If the bandage sticks to the wound, soak it in cool water to loosen it before removal."
        },
        {
          title: "Manage Pain",
          description: "Over-the-counter pain relievers like ibuprofen or acetaminophen can help reduce pain and inflammation. For more severe pain, particularly with second-degree burns, consult a healthcare provider for appropriate pain management."
        },
        {
          title: "Monitor for Infection",
          description: "Watch for signs of infection such as increased pain, redness, swelling, oozing, foul smell, fever, or red streaking from the burn area. Infected burns require immediate medical attention."
        },
        {
          title: "Follow-up Care",
          description: "Seek medical attention if the burn doesn't show improvement within 2 weeks, if infection develops, or if there's significant scarring. Continue to protect healed burns from sun exposure with clothing or sunscreen for at least 1 year."
        }
      ],
      warnings: [
        "Do NOT apply butter, oil, toothpaste, egg whites, ice, or cotton balls to burns.",
        "Do NOT break blisters intentionally, as this increases risk of infection and slows healing.",
        "Do NOT use cold water or ice for large burns, as this can cause hypothermia.",
        "Do NOT apply pressure to burn areas or tape directly over burns.",
        "Chemical burns require continuous water flushing for at least 20 minutes.",
        "Seek immediate medical attention for third-degree burns, chemical burns, electrical burns, or large second-degree burns."
      ],
      notes: [
        "For chemical burns: Remove contaminated clothing using gloves and flush with running water for at least 20 minutes. Do not attempt to neutralize chemicals unless specifically instructed by poison control.",
        "For electrical burns: Check for both entry and exit wounds, as internal damage may be much worse than visible burns. These burns always require medical evaluation due to risk of internal damage.",
        "For sunburn: Apply aloe vera gel and drink extra water to prevent dehydration. For severe sunburn with blisters, treat as a second-degree burn.",
        "For burn blisters: Small blisters (less than 1/2 inch) may be left intact and protected. Larger blisters may need medical evaluation.",
        "The healing time varies by burn depth: first-degree burns typically heal within a week, second-degree burns may take 2-3 weeks, and third-degree burns require medical treatment and may need skin grafting.",
        "Keeping burns properly moisturized after the initial cooling period can help reduce scarring. Medical-grade silicone gel sheets may be recommended for scar management once the burn has fully healed."
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
      description: "Advanced protocol for recognizing and responding to severe allergic reactions and anaphylaxis, including proper administration of epinephrine auto-injectors.",
      steps: [
        {
          title: "Recognize Anaphylaxis Symptoms",
          description: "Anaphylaxis typically affects multiple body systems simultaneously. Watch for: SKIN: widespread hives, redness, itching, swelling (especially face/lips/tongue); RESPIRATORY: difficulty breathing, wheezing, stridor, persistent cough, tightness in throat, hoarse voice, nasal congestion; CARDIOVASCULAR: dizziness, fainting, low blood pressure (hypotension), rapid heartbeat (tachycardia), chest pain, blue-tinged skin (cyanosis); GASTROINTESTINAL: nausea, vomiting, diarrhea, abdominal cramps; NEUROLOGICAL: anxiety, confusion, sense of doom, loss of consciousness. Symptoms usually develop rapidly within minutes to 2 hours after exposure.",
          important: true
        },
        {
          title: "Assess Severity and Call Emergency Services",
          description: "Anaphylaxis is likely if there is rapid onset of symptoms affecting multiple body systems, especially with respiratory or cardiovascular involvement, following exposure to a known or suspected allergen. Call 103 (Mongolia) immediately. Do not wait to see if mild symptoms resolve - anaphylaxis can progress rapidly and is potentially fatal.",
          important: true
        },
        {
          title: "Administer Epinephrine If Available",
          description: "Epinephrine (adrenaline) is the first-line, life-saving treatment for anaphylaxis. If the person has an auto-injector (EpiPen, Auvi-Q, Jext, Emerade, etc.), help them use it or administer it yourself if they cannot. Remove safety cap, place the injector firmly against the outer middle thigh at a 90-degree angle, and push until it clicks. Hold for 3-10 seconds (depending on manufacturer instructions). The injection can be done through clothing. Auto-injectors deliver a fixed dose: 0.3mg for adults/children >30kg, or 0.15mg for children 15-30kg.",
          important: true
        },
        {
          title: "Note the Time and Position the Person",
          description: "Note the exact time of epinephrine administration. Have the person lie flat with legs elevated to improve blood flow to vital organs, unless they are having trouble breathing or vomiting, in which case have them sit up or lie on their side (recovery position) to prevent aspiration. If they are pregnant, position them on their left side with a slight tilt to the right to prevent compression of the vena cava."
        },
        {
          title: "Remove the Allergen If Possible",
          description: "If the reaction is from a bee/wasp sting, gently remove the stinger by scraping horizontally with a firm edge like a credit card (don't use tweezers or pinch as this may inject more venom). For food allergens, have the person rinse their mouth and spit out any remaining food but do not induce vomiting. For contact allergens, remove contaminated clothing and rinse skin with water."
        },
        {
          title: "Monitor Vital Signs",
          description: "Continuously monitor breathing, pulse, blood pressure (if equipment available), and level of consciousness while waiting for emergency services. Normal vital signs: adults - respiratory rate 12-20/min, heart rate 60-100/min, systolic BP >90mmHg; children - rates vary by age. Document changes for medical personnel."
        },
        {
          title: "Administer Second Dose If Needed",
          description: "Epinephrine's effects typically last 10-20 minutes. If symptoms don't improve or worsen within 5-15 minutes after the first dose and emergency responders haven't arrived, administer a second dose if available. Up to 30% of anaphylaxis cases require multiple doses of epinephrine."
        },
        {
          title: "Administer Secondary Medications If Prescribed",
          description: "After epinephrine, if the person has prescribed antihistamines or asthma medications and can swallow safely, these may be given as secondary treatments. Note that these are NOT substitutes for epinephrine and should never delay epinephrine administration."
        },
        {
          title: "Provide CPR If Necessary",
          description: "If the person becomes unresponsive and stops breathing normally or has no pulse, begin CPR immediately. For anaphylaxis victims, high-quality chest compressions are critical as circulation may be severely compromised by vasodilation and fluid leakage from blood vessels."
        },
        {
          title: "Prepare for Advanced Medical Care",
          description: "Emergency responders may administer additional medications such as IV epinephrine, antihistamines, corticosteroids, bronchodilators, vasopressors, and IV fluids. Gather information about the allergic trigger, timing of exposure, symptoms progression, and any medications already administered to report to medical personnel."
        }
      ],
      warnings: [
        "Never delay administering epinephrine or calling emergency services if anaphylaxis is suspected - minutes matter and can mean the difference between life and death.",
        "Do not have the person stand, walk, or exert themselves, even if they appear to be recovering, as this can worsen shock and cause sudden collapse.",
        "Don't give oral medications for an allergic reaction if the person is having difficulty breathing, swallowing, or showing signs of shock.",
        "Non-sedating antihistamines (like cetirizine) are preferred over sedating ones (like diphenhydramine/Benadryl) for anaphylaxis as they don't mask symptoms of deterioration.",
        "Asthma inhalers (bronchodilators) may help with breathing difficulties but are NOT a substitute for epinephrine in anaphylaxis.",
        "Beta-blocker medications can reduce the effectiveness of epinephrine - inform emergency personnel if the person takes these medications."
      ],
      notes: [
        "Common triggers for anaphylaxis include foods (especially peanuts, tree nuts, shellfish, fish, milk, eggs, wheat, soy), medications (antibiotics, NSAIDs, chemotherapy drugs), insect venom (bees, wasps, hornets, fire ants), latex, exercise, and rarely cold or heat.",
        "Biphasic reactions occur in 1-20% of anaphylaxis cases, where symptoms resolve then return hours (typically 8-12 hours) later without re-exposure to the allergen. This is why monitoring in a medical facility for at least 4-8 hours is important.",
        "Epinephrine auto-injectors should be stored at room temperature (15-25°C/59-77°F), protected from light, and not refrigerated or left in hot environments like cars. Check regularly for expiration and solution clarity (should be clear, not cloudy).",
        "Children with known severe allergies should have an Anaphylaxis Action Plan at school and with caregivers, detailing emergency contacts and step-by-step response instructions.",
        "Risk factors for severe or fatal anaphylaxis include delayed epinephrine administration, asthma (especially poorly controlled), cardiovascular disease, mastocytosis, and previous severe reactions.",
        "After an anaphylactic episode, referral to an allergist for comprehensive evaluation, allergen identification, and preventive planning is essential."
      ]
    },
    "poisoning": {
      id: "poisoning",
      title: "Poisoning Response",
      description: "Comprehensive guide for different types of poisoning emergencies including ingestion, inhalation, skin/eye contact, and specific toxins.",
      steps: [
        {
          title: "Ensure Safety First",
          description: "Make sure you're not at risk of exposure to the poison. For inhalation poisoning, never enter a contaminated area without proper protection - wait for emergency responders with proper equipment. For chemical exposure, wear protective gloves and avoid direct contact with the substance. Remove the person from the source of poisoning if safe to do so.",
          important: true
        },
        {
          title: "Call for Emergency Help",
          description: "Call emergency services (103 in Mongolia) or the poison control center immediately. Be ready to provide: the exact name of the poison/substance (read from container if available), estimated amount, route of exposure (swallowed, inhaled, skin/eye contact), time elapsed since exposure, the person's age and weight, symptoms observed, and any first aid already given.",
          important: true
        },
        {
          title: "Assess Vital Signs and Level of Consciousness",
          description: "Check if the person is responsive, breathing normally, and has a pulse. Note any changes in mental status, such as confusion, drowsiness, agitation, or loss of consciousness. These can be critical indicators of poisoning severity. Document vital signs (pulse rate, breathing rate) if possible."
        },
        {
          title: "For Ingested Poisons (Swallowed Toxins)",
          description: "Do NOT induce vomiting unless specifically instructed by poison control or medical professionals. Do NOT give anything to drink or eat unless advised. If the person vomits spontaneously, turn their head to the side to prevent choking, collect a sample if possible for identification. Do NOT give activated charcoal unless directed by medical professionals. For petroleum products, caustic chemicals (acids/alkalis), or if the person is unconscious or having seizures, DO NOT attempt to make them vomit under any circumstances.",
          important: true
        },
        {
          title: "For Inhaled Poisons (Toxic Gases or Vapors)",
          description: "Get the person to fresh air immediately. If safe, open doors and windows for ventilation. If the person was in an enclosed space with carbon monoxide or other toxic fumes, be aware they may require oxygen therapy. For gases like chlorine or ammonia that irritate the airway, avoid having the victim shout or speak unnecessarily, as this may worsen airway damage. Watch carefully for signs of respiratory distress including rapid breathing, blue discoloration of lips/skin, gasping, or wheezing.",
          important: true
        },
        {
          title: "For Skin Contact with Poisons",
          description: "Remove contaminated clothing using gloves; cut off clothing if necessary rather than pulling it over the head. Rinse the affected skin thoroughly with cool running water for at least 15-20 minutes. For dry chemicals, brush off the material before rinsing unless it's reactive with water (check container). For oil-based poisons, wash with soap and water. For chemical burns, continue rinsing until emergency help arrives. Do not apply creams, ointments, or home remedies to chemical burns."
        },
        {
          title: "For Eye Contact with Poisons",
          description: "Act immediately as chemical eye injuries can cause permanent damage within minutes. Flush the eye with clean, lukewarm water or saline solution for at least 15-20 minutes. Hold the eyelid open and pour water from the inner corner (near nose) to the outer corner, allowing it to run off the face. If contact lenses are present, try to remove them after a few minutes of flushing if they come out easily - don't delay initial flushing. For caustic substances (acids/alkalis), extend flushing time to 30+ minutes. Continue flushing even during transport to medical care."
        },
        {
          title: "For Specific Common Poisons",
          description: "For medications overdose: Bring all medication containers to the hospital. For opioid overdose: If available and you're trained, administer naloxone (Narcan). For petroleum products (gasoline, kerosene): Do NOT induce vomiting as aspiration can cause severe lung damage. For alcohol poisoning: Keep the person awake if possible, position on their side if drowsy to prevent choking. For button battery ingestion (especially in children): Seek immediate emergency care - these can cause severe damage within 2 hours. For caustic substances (strong acids/alkalis): Do NOT induce vomiting, give small sips of water if the person is alert and able to swallow."
        },
        {
          title: "For Carbon Monoxide Poisoning",
          description: "Symptoms include headache, dizziness, weakness, nausea, confusion, chest pain, and eventually loss of consciousness. Recognize that the victim may have cherry-red lips and skin in severe cases, but often has no visible symptoms. Get the person to fresh air immediately, open windows and doors, turn off gas appliances, and evacuate the area. This is an immediate medical emergency requiring oxygen therapy - call emergency services right away.",
          important: true
        },
        {
          title: "Save Containers and Evidence",
          description: "Keep the poison container, plant material, medication bottles, or other evidence for identification by medical professionals. Take photos of labels if possible. For unknown mushrooms or plants, if practical and safe, collect a sample in a paper (not plastic) bag for identification."
        },
        {
          title: "Provide CPR If Necessary",
          description: "If the person becomes unresponsive and is not breathing normally, begin CPR immediately if you're trained. For respiratory failure from poisoning, effective breathing support is critical. If giving rescue breaths, use a barrier device if available, especially for poisonings that could affect rescuers through contact (such as cyanide or organophosphates)."
        }
      ],
      warnings: [
        "Never induce vomiting or give antidotes unless directed by medical professionals. Certain poisons cause more damage if vomited.",
        "Never try to neutralize a poison with lemon juice, vinegar, or other home remedies. Chemical reactions may cause additional damage.",
        "Do not give milk, alcohol, salt water, or any other substance as a 'universal antidote' - these don't work and can worsen outcomes.",
        "Do not delay calling for emergency help while looking for information or antidotes.",
        "For unconscious victims, never administer anything by mouth due to the risk of choking and aspiration.",
        "Poisonous plants and mushrooms can cause delayed symptoms - don't wait for symptoms to worsen before seeking help."
      ],
      notes: [
        "Carbon monoxide poisoning is especially dangerous because it is colorless, odorless, and prevents oxygen transport in the blood. Winter months in Mongolia pose higher risk due to indoor heating systems - install CO detectors and ensure proper ventilation.",
        "Food poisoning typically presents with nausea, vomiting, diarrhea, and abdominal cramps 2-72 hours after consuming contaminated food, depending on the pathogen. Severe symptoms include bloody stool, high fever (>101.5°F/38.6°C), dehydration, and difficulty swallowing.",
        "Childproof your home by keeping all medications, household chemicals, and plants out of reach. Use safety latches on cabinets, store products in original containers, and teach children about poison hazards.",
        "Activated charcoal is used in some poisoning cases but should only be administered under medical direction. It doesn't work for all poisons and can be harmful in some situations.",
        "Keep the poison control number easily accessible. In many countries, poison centers provide free, expert advice 24/7 and can often help manage minor exposures at home, preventing unnecessary hospital visits.",
        "Common household poisons include cleaning products, medications, pesticides, automotive fluids, personal care products, batteries, and certain plants. In rural Mongolia, additional risks include agricultural chemicals and traditional herbal preparations with toxic components.",
        "Prevention is key: label all containers properly, never store chemicals in food containers, don't mix cleaning products (especially bleach with ammonia or acids), and ensure proper ventilation when using chemicals."
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
      description: "Comprehensive guide for managing hypoglycemia, hyperglycemia, diabetic ketoacidosis (DKA), and hyperosmolar hyperglycemic state (HHS) emergencies.",
      steps: [
        {
          title: "Recognize Type of Emergency",
          description: "Hypoglycemia (low blood sugar, <70 mg/dL or 3.9 mmol/L): sudden onset, confusion, shakiness, sweating, hunger, irritability, pale skin, heart racing, weakness, anxiety, headache, blurred vision, slurred speech, seizures, loss of consciousness. Hyperglycemia (high blood sugar, >180 mg/dL or 10 mmol/L): develops over hours/days, extreme thirst, frequent urination, fatigue, dry mouth, blurred vision, headache, nausea/vomiting. DKA (primarily in Type 1): fruity breath odor, deep labored breathing, abdominal pain, confusion. HHS (primarily in Type 2): extreme dehydration, confusion, seizures, focal neurological deficits.",
          important: true
        },
        {
          title: "Check Blood Glucose If Possible",
          description: "If a blood glucose meter is available and the person or someone present knows how to use it, check the blood sugar level to confirm the condition. For suspected ketoacidosis, check for ketones in urine if ketone test strips are available."
        },
        {
          title: "For Mild to Moderate Hypoglycemia",
          description: "If the person is conscious, alert, and able to swallow safely, give 15-20 grams of fast-acting carbohydrates: 4 glucose tablets, 1/2 cup (4 oz) fruit juice or regular soda, 1 tablespoon honey or syrup, 8-10 small candies (like jelly beans), or 1 tube of glucose gel. Wait 15 minutes and recheck blood sugar if possible. If still below 70 mg/dL (3.9 mmol/L), repeat treatment. Once blood sugar is normal, provide a small snack with protein if the next meal is more than an hour away.",
          important: true
        },
        {
          title: "For Severe Hypoglycemia",
          description: "If the person is unconscious, having seizures, or unable to swallow safely, do not give anything by mouth. Call emergency services (103 in Mongolia) immediately. If available and you are trained, administer glucagon via injection (glucagon emergency kit) or nasal spray (Baqsimi) according to package directions. Place in recovery position if unconscious but breathing. Stay with them until emergency help arrives.",
          important: true
        },
        {
          title: "For Hyperglycemia",
          description: "Have the person drink water (if conscious and not nauseated) to prevent dehydration - aim for 8-16 oz (240-480 mL) per hour if possible. Do not attempt to administer insulin unless you are the person's caregiver and have clear instructions. Help them test their blood sugar if equipment is available. If the person uses insulin and has missed a dose, help them follow their prescribed regimen if they are able to direct you."
        },
        {
          title: "For Diabetic Ketoacidosis (DKA) or Hyperosmolar Hyperglycemic State (HHS)",
          description: "These are medical emergencies requiring immediate hospitalization. Call emergency services (103 in Mongolia) immediately. Do not attempt to treat at home. Signs of DKA include fruity breath odor, deep labored breathing (Kussmaul breathing), abdominal pain, confusion, and dehydration. Signs of HHS include extreme thirst, confusion, weakness, and may progress to seizures or coma. Keep the person hydrated with water if conscious and able to drink while awaiting emergency services.",
          important: true
        },
        {
          title: "Call Emergency Services",
          description: "Call 103 (Mongolia) immediately if: the person is unconscious or extremely disoriented, unable to eat or drink, having seizures, has severe symptoms, blood sugar remains extremely high (>250 mg/dL or 13.9 mmol/L) with symptoms, ketoacidosis is suspected (fruity breath odor), the person is pregnant, elderly, or has other chronic conditions, or condition doesn't improve quickly with treatment.",
          important: true
        },
        {
          title: "Position the Person",
          description: "If unconscious but breathing, place in the recovery position (on their side) to prevent choking if vomiting occurs. If not breathing normally, begin CPR if trained."
        },
        {
          title: "Monitor and Reassess",
          description: "After treatment, continue to monitor the person's condition. For hypoglycemia, symptoms should improve within 10-15 minutes of consuming sugar. For hyperglycemia, improvement may take longer. Be prepared to seek emergency care if the person's condition worsens or does not improve."
        },
        {
          title: "Document and Communicate",
          description: "Note the time and type of symptoms, treatments given, blood sugar readings, and any known medications the person takes. Report this information to emergency responders. If the person has an insulin pump, inform medical personnel."
        }
      ],
      warnings: [
        "Never give food or drink to someone who is unconscious or unable to swallow safely.",
        "Do not attempt to give insulin to someone with low blood sugar - this will make the situation worse and can be fatal.",
        "Do not exercise or leave alone a person experiencing a diabetic emergency.",
        "If unsure whether blood sugar is high or low, treat for low blood sugar first, as this is more immediately dangerous.",
        "Do not delay seeking medical help for DKA or HHS - these conditions are life-threatening.",
        "Some diabetes medications, particularly sulfonylureas and insulin, can cause prolonged hypoglycemia that may recur after initial treatment."
      ],
      notes: [
        "The person may have a medical ID bracelet, necklace, or card indicating they have diabetes. Check for this information.",
        "Many people with diabetes carry glucose tablets, gel, or other emergency sugar sources. Check their pockets, purse, or backpack.",
        "Continuous glucose monitors (CGMs) may be worn on the arm or abdomen and can provide current glucose readings and trends.",
        "Insulin pumps deliver continuous insulin and are typically worn on the belt, in a pocket, or attached to clothing with tubing connected to the body.",
        "Diabetic ketoacidosis (DKA) is a life-threatening condition usually developing in type 1 diabetes. It can develop within hours and requires immediate medical care.",
        "Hyperosmolar hyperglycemic state (HHS) typically occurs in type 2 diabetes, develops more slowly than DKA, and has a higher mortality rate.",
        "Hypoglycemia can sometimes resemble intoxication or stroke - check for medical ID if you encounter a disoriented person.",
        "People with long-standing diabetes may have impaired awareness of hypoglycemia and not recognize when their blood sugar is dangerously low.",
        "For people taking SGLT2 inhibitors (medications ending in '-flozin'), DKA can occur even with only mildly elevated blood glucose levels."
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
    "spinalinjury": {
      id: "spinalinjury",
      title: "Spinal Injury Management",
      description: "Advanced protocol for immobilization techniques and precautions for suspected spinal injuries, focusing on preventing further damage.",
      steps: [
        {
          title: "Recognize Signs of Spinal Injury",
          description: "Be alert for: mechanism of injury (falls, vehicle accidents, diving injuries, sports injuries with axial loading); pain or tenderness in the neck or back; loss of movement or sensation below the injury site; numbness, tingling, or weakness in limbs; loss of bladder/bowel control; irregular breathing; altered level of consciousness; visible deformity of the spine; paralysis (partial or complete). In an unconscious person, always assume spinal injury if the mechanism suggests it.",
          important: true
        },
        {
          title: "Call Emergency Services",
          description: "Call 103 (Mongolia) immediately for any suspected spinal injury. Spinal cord injuries require specialized care and rapid transport to appropriate medical facilities. Inform dispatchers of suspected spinal injury so proper equipment and personnel can be sent.",
          important: true
        },
        {
          title: "Stabilize the Head and Neck",
          description: "Place your hands on both sides of the person's head, positioning it in a neutral in-line position (aligned with spine, neither flexed forward nor extended backward). Maintain this manual stabilization continuously until emergency personnel arrive with proper immobilization equipment. Do not allow the head or neck to twist or bend in any direction.",
          important: true
        },
        {
          title: "Avoid Moving the Person",
          description: "Do not move or allow the person to move unless they are in immediate danger (e.g., fire, explosion risk, toxic environment). Movement can cause further damage to the spinal cord. If movement is absolutely necessary, use the log-roll technique described below with multiple helpers.",
          important: true
        },
        {
          title: "Log-Roll Technique (Only If Absolutely Necessary)",
          description: "This requires at least 3-4 people. One person maintains head/neck stabilization throughout. Others position themselves along the person's body. On a coordinated command, roll the entire body as a single unit (like a log), maintaining spinal alignment at all times. Never twist or bend the spine during movement."
        },
        {
          title: "Assess Breathing and Circulation",
          description: "Without moving the head or neck, check if the person is breathing adequately. High spinal cord injuries can affect breathing muscles. Monitor pulse and skin color. Note that spinal shock can cause low blood pressure (hypotension) and slow heart rate (bradycardia), especially with cervical (neck) injuries."
        },
        {
          title: "Perform Modified CPR If Necessary",
          description: "If the person isn't breathing adequately and needs CPR, maintain spinal stabilization while performing chest compressions. For rescue breaths, minimize head tilt by using the jaw-thrust maneuver instead (push jaw forward without tilting head), if you're trained in this technique."
        },
        {
          title: "Document Neurological Status",
          description: "If the person is conscious, document their neurological status while waiting for emergency services: what can they feel and move? Ask them to wiggle toes, move fingers, feel touch on various body parts. Note any changes in these abilities over time, as deterioration or improvement provides important information for medical personnel."
        },
        {
          title: "Prevent Hypothermia",
          description: "Cover the person with blankets or coats to prevent heat loss, but place these items around them without lifting or moving them. Spinal cord injury can affect temperature regulation, making the person more susceptible to hypothermia."
        },
        {
          title: "Provide Emotional Support",
          description: "A suspected spinal injury is extremely frightening. Reassure the person, explain what you're doing, and encourage them to remain still. Anxiety can lead to movement that might worsen the injury. Maintain verbal contact and provide updates about emergency services' arrival."
        }
      ],
      warnings: [
        "Never attempt to 'straighten' or 'realign' the spine - this should only be done by trained medical professionals with proper equipment.",
        "Do not allow the person to move their head or neck, even if they say they're fine or have no pain. Spinal cord injury may not immediately cause pain or symptoms.",
        "Never remove a helmet (sports, motorcycle) from an injured person with suspected spinal injury unless you're trained to do so and it's interfering with essential breathing or resuscitation.",
        "Do not give food or drink, as the person may require surgery.",
        "Do not attempt to transport the person yourself - wait for properly equipped emergency services."
      ],
      notes: [
        "Spinal cord injury can occur without spinal column fracture, and fractures can occur without immediate spinal cord damage. Both require the same careful approach.",
        "Motor vehicle accidents, falls from heights, diving accidents, sports injuries, and violent trauma are the most common causes of spinal injuries.",
        "The concept of the 'Golden Hour' applies to spinal cord injuries - early professional intervention improves outcomes, as secondary damage from swelling and inflammation may be preventable.",
        "In rural areas of Mongolia where medical help may be delayed, prolonged spinal immobilization is essential during transport. If commercial equipment isn't available, improvise with items like rolled blankets or clothing on either side of the head to maintain position.",
        "Children and elderly persons are at higher risk for spinal injuries even from seemingly minor trauma due to different anatomical and physiological characteristics.",
        "Alcohol and drug intoxication complicate assessment, as usual indicators of pain or neurological deficits may be masked - err on the side of caution with immobilization.",
        "Spinal cord injury resulting in paralysis below the injury level is a medical emergency that can result in permanent disability. Proper immediate care significantly impacts long-term outcomes."
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