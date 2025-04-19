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
          <h1 className="text-2xl font-bold text-gray-800 mb-4">Protocol Not Found</h1>
          <p className="text-gray-600 mb-6">The emergency protocol you're looking for doesn't exist.</p>
          <Link href="/emergency">
            <a className="bg-primary text-white px-6 py-2 rounded-md inline-flex items-center">
              <ArrowLeft className="w-4 h-4 mr-2" />
              <span>Back to All Protocols</span>
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
          <span>Print</span>
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md inline-flex items-center text-sm">
          <Share2 className="w-4 h-4 mr-2" />
          <span>Share</span>
        </button>
        <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md inline-flex items-center text-sm">
          <Bookmark className="w-4 h-4 mr-2" />
          <span>Save</span>
        </button>
      </div>

      {/* Steps */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-6">
        <div className="bg-primary text-white px-6 py-3">
          <h2 className="font-semibold">Step-by-Step Instructions</h2>
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
            <h2 className="font-semibold">Important Warnings</h2>
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
            <h2 className="font-semibold text-gray-800">Additional Notes</h2>
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