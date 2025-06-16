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
        title: "Check for Responsiveness",
        description: "Tap the person's shoulders firmly and shout 'Are you okay?' If there's no response and the person isn't breathing normally, begin CPR immediately.",
        important: true
      },
      {
        title: "Call 911 and Get AED",
        description: "Call 911 immediately or have someone else do it. Request an AED if available. Don't leave the person unless absolutely necessary.",
        important: true
      },
      {
        title: "Position Your Hands Correctly",
        description: "Place the heel of one hand on the center of the chest between the nipples. Place your other hand on top, interlacing your fingers. Keep your arms straight.",
        important: true
      },
      {
        title: "Begin Chest Compressions",
        description: "Push hard and fast at least 2 inches deep. Allow complete chest recoil between compressions. Compress at 100-120 times per minute. Count out loud.",
        important: true
      },
      {
        title: "Continue Until Help Arrives",
        description: "Don't stop compressions until emergency services arrive or the person starts breathing normally. Switch with another rescuer every 2 minutes if possible.",
        important: true
      }
    ],
    "choking-2025": [
      {
        title: "Assess the Situation",
        description: "Ask 'Are you choking?' If the person can cough or speak, encourage continued coughing. If they cannot breathe, cough, or speak, begin immediate intervention.",
        important: true
      },
      {
        title: "Give 5 Back Blows",
        description: "Stand to the side and slightly behind the person. Support their chest with one hand and lean them forward. Give up to 5 sharp back blows between the shoulder blades with the heel of your hand.",
        important: true
      },
      {
        title: "Perform 5 Abdominal Thrusts",
        description: "If back blows don't work, stand behind the person. Place your fist just above the navel, grasp it with your other hand, and give up to 5 quick upward thrusts.",
        important: true
      },
      {
        title: "Repeat Cycle",
        description: "Continue alternating 5 back blows and 5 abdominal thrusts until the object is expelled or the person becomes unconscious.",
        important: true
      },
      {
        title: "If Person Becomes Unconscious",
        description: "Lower them to the ground, call 911, and begin CPR starting with chest compressions. Check the mouth before giving rescue breaths and remove any visible objects.",
        important: true
      }
    ],
    "stroke-2025": [
      {
        title: "Balance - Check for Loss of Coordination",
        description: "Look for sudden loss of balance, dizziness, coordination, or trouble walking. Ask the person to walk if safe to do so.",
        important: true
      },
      {
        title: "Eyes - Check for Vision Loss",
        description: "Ask about sudden vision loss or changes, double vision, or visual field cuts. Have them track your finger with their eyes.",
        important: true
      },
      {
        title: "Face - Check for Facial Drooping",
        description: "Ask the person to smile. Look for uneven or lopsided smile, facial numbness, or drooping on one side of the face.",
        important: true
      },
      {
        title: "Arms - Check for Weakness",
        description: "Ask the person to raise both arms above their head for 10 seconds. Look for one arm drifting downward or inability to lift one arm.",
        important: true
      },
      {
        title: "Speech - Check for Speech Problems",
        description: "Ask them to repeat a simple phrase. Listen for slurred speech, strange words, or inability to understand or speak.",
        important: true
      },
      {
        title: "Time - Call 911 Immediately",
        description: "If any of the above signs are present, note the time symptoms started and call 911 immediately. Time is brain - every minute counts.",
        important: true
      }
    ],
    "bleeding-control-2025": [
      {
        title: "Ensure Scene Safety",
        description: "Check for ongoing dangers (traffic, violence, hazards). Wear gloves or use barrier protection. Don't become another victim.",
        important: true
      },
      {
        title: "Call 911 Immediately",
        description: "Call for emergency medical services. For severe bleeding, also request blood products and trauma team activation.",
        important: true
      },
      {
        title: "Apply Direct Pressure",
        description: "Place clean cloth or gauze directly on the wound. Press firmly and continuously. Don't remove blood-soaked materials - add more on top.",
        important: true
      },
      {
        title: "Elevate the Injury",
        description: "If possible and no fracture suspected, raise the bleeding area above the heart level to reduce blood flow.",
        important: false
      },
      {
        title: "Apply Pressure to Pressure Points",
        description: "If direct pressure fails, apply pressure to arterial pressure points between the wound and the heart.",
        important: true
      },
      {
        title: "Consider Tourniquet",
        description: "For severe limb bleeding that won't stop, apply tourniquet 2-3 inches above the wound. Note time of application.",
        important: true
      }
    ],
    "burns-2025": [
      {
        title: "Remove from Heat Source",
        description: "Safely remove the person from the heat source. For electrical burns, ensure power is turned off before touching the victim. For chemical burns, remove contaminated clothing.",
        important: true
      },
      {
        title: "Cool the Burn",
        description: "For thermal burns, immediately cool with clean, cool (not ice-cold) water for 10-20 minutes. Remove jewelry and tight clothing before swelling occurs.",
        important: true
      },
      {
        title: "Assess Burn Severity",
        description: "First-degree: red, painful. Second-degree: blistered, very painful. Third-degree: white/charred, may be painless. Call 911 for second-degree burns larger than 3 inches or any third-degree burns.",
        important: true
      },
      {
        title: "Cover the Burn",
        description: "Use sterile gauze or clean cloth. Don't use cotton balls or adhesive bandages directly on burns. Don't apply ice, butter, or ointments.",
        important: false
      },
      {
        title: "Treat for Shock",
        description: "For severe burns, treat for shock by keeping the person warm and elevating legs if possible. Monitor breathing and be prepared for CPR.",
        important: true
      }
    ],
    "heart-attack-2025": [
      {
        title: "Recognize Heart Attack Signs",
        description: "Chest pain/pressure, shortness of breath, nausea, sweating, pain radiating to arms/jaw/back. Women may have atypical symptoms.",
        important: true
      },
      {
        title: "Call 911 Immediately",
        description: "Call emergency services immediately. Tell them you suspect a heart attack. Request ALS and cardiac catheterization team.",
        important: true
      },
      {
        title: "Give Aspirin if Available",
        description: "Give 325mg aspirin (4 baby aspirin) to chew if person is conscious, not allergic, and no bleeding disorders. Don't delay 911 call.",
        important: true
      },
      {
        title: "Position Comfortably",
        description: "Help person sit upright or in position of comfort. Loosen tight clothing. Keep person calm and still.",
        important: false
      },
      {
        title: "Monitor and Prepare for CPR",
        description: "Monitor breathing and pulse. Be prepared to start CPR if person becomes unconscious or stops breathing.",
        important: true
      }
    ],
    "anaphylaxis-2025": [
      {
        title: "Recognize Anaphylaxis Signs",
        description: "Difficulty breathing, swelling of face/throat, rapid weak pulse, skin rash, nausea/vomiting, dizziness. This is life-threatening.",
        important: true
      },
      {
        title: "Call 911 Immediately",
        description: "Call emergency services immediately. Tell them it's anaphylaxis. Request epinephrine and advanced life support.",
        important: true
      },
      {
        title: "Use Epinephrine Auto-Injector",
        description: "If available, use epinephrine auto-injector (EpiPen) immediately. Inject into outer thigh through clothing if necessary. Hold for 10 seconds.",
        important: true
      },
      {
        title: "Remove or Avoid Trigger",
        description: "If possible, remove or help person avoid the allergen that caused the reaction (food, medication, insect sting, etc.).",
        important: false
      },
      {
        title: "Position the Person",
        description: "Have the person lie down with legs elevated. If breathing is difficult, allow them to sit up. Do not give anything to drink.",
        important: true
      },
      {
        title: "Be Prepared for Second Dose",
        description: "A second epinephrine injection may be needed in 5-15 minutes if symptoms don't improve. Monitor closely until help arrives.",
        important: true
      }
    ],
    "respiratory-distress-2025": [
      {
        title: "Assess Breathing Difficulty",
        description: "Look for signs of severe respiratory distress: inability to speak in full sentences, use of accessory muscles, blue lips/fingernails, extreme anxiety.",
        important: true
      },
      {
        title: "Call 911 for Severe Cases",
        description: "Call emergency services if severe distress, unconsciousness, or blue discoloration. Request advanced airway management.",
        important: true
      },
      {
        title: "Position for Optimal Breathing",
        description: "Help person sit upright in tripod position (leaning forward on hands). This opens airways and reduces work of breathing.",
        important: true
      },
      {
        title: "Assist with Medications",
        description: "Help person use their rescue inhaler (albuterol) if available. Remove any triggers like allergens or irritants.",
        important: true
      },
      {
        title: "Monitor and Reassure",
        description: "Stay calm and reassure the person. Coach slow, deep breathing. Be prepared to assist ventilations if breathing stops.",
        important: true
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
                  
                  {step.imageUrl && (
                    <div className="mt-4">
                      <MultimediaButton url={step.imageUrl} type="image" title={step.title} />
                    </div>
                  )}
                  
                  {step.videoUrl && (
                    <div className="mt-4">
                      <MultimediaButton url={step.videoUrl} type="video" title={step.title} />
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
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