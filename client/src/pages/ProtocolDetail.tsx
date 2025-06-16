import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams, Link } from "wouter";
import { emergencyProtocols } from "../data/protocols";
import { 
  AlertTriangle, 
  ArrowLeft, 
  Bookmark, 
  Printer, 
  Share2, 
  Info,
  BookOpen,
  Clock,
  Shield
} from "lucide-react";

interface ProtocolStep {
  title: string;
  description: string;
  important?: boolean;
  duration?: string;
  tips?: string[];
}

interface Protocol {
  id: string;
  title: string;
  description: string;
  steps: ProtocolStep[];
  warnings?: string[];
  notes?: string[];
  quickTips?: string[];
}

const getProtocolById = (id: string): Protocol | null => {
  const basicProtocol = emergencyProtocols.find(p => p.id === id);
  if (!basicProtocol) return null;

  const protocolSteps: Record<string, ProtocolStep[]> = {
    "cpr-2025": [
      {
        title: "Check for Responsiveness and Breathing",
        description: "Tap the person's shoulders firmly and shout 'Are you okay?' Check for normal breathing by looking for chest rise and fall for no more than 10 seconds. If there's no response and the person isn't breathing normally or only gasping, begin CPR immediately.",
        important: true,
        duration: "10 seconds maximum",
        tips: ["Don't check for pulse as a layperson", "Gasping is not normal breathing", "Call for help immediately"]
      },
      {
        title: "Call 911 and Get AED",
        description: "Call 911 immediately or designate someone specific ('You in the red shirt, call 911'). Request an AED if available. Put phone on speaker if alone. Provide exact location and follow dispatcher instructions.",
        important: true,
        duration: "30 seconds",
        tips: ["Be specific when asking for help", "Stay on the line with 911", "Don't leave the victim alone"]
      },
      {
        title: "Position Your Hands Correctly",
        description: "Kneel beside the chest. Place heel of one hand on center of chest between nipples. Place other hand on top, interlocking fingers. Keep arms straight, shoulders over hands.",
        important: true,
        duration: "5-10 seconds",
        tips: ["Only heel of hand touches chest", "Keep fingers off ribs", "Position yourself directly over victim"]
      },
      {
        title: "Begin High-Quality Chest Compressions",
        description: "Push hard and fast at least 2 inches deep (but no more than 2.4 inches). Allow complete chest recoil. Compress at 100-120 per minute. Count aloud: '1 and 2 and 3...' Minimize interruptions.",
        important: true,
        duration: "Continuous until help arrives",
        tips: ["Think 'Stayin' Alive' song tempo", "Don't lean on chest between compressions", "Switch rescuers every 2 minutes if possible"]
      },
      {
        title: "Add Rescue Breaths (If Trained)",
        description: "After 30 compressions: tilt head back, lift chin, pinch nose, give 2 breaths (1 second each). Watch for chest rise. If untrained, provide continuous chest compressions only.",
        important: false,
        duration: "30:2 ratio if trained",
        tips: ["Hands-only CPR is effective for untrained rescuers", "Each breath should make chest rise", "Don't over-ventilate"]
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
        title: "Assess the Choking Situation",
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
        title: "Recognize Heart Attack Signs",
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
      "Call 911 first, then give aspirin if safe",
      "Sit upright, stay calm, don't exert",
      "Be ready to start CPR if needed"
    ]
  };

  return {
    id: basicProtocol.id,
    title: basicProtocol.title,
    description: basicProtocol.description,
    steps: protocolSteps[id] || [
      {
        title: "Scene Assessment",
        description: "Assess situation for safety hazards and determine emergency nature. Ensure your safety before approaching.",
        important: true,
        duration: "15-30 seconds",
        tips: ["Safety first", "Call for help", "Don't become another victim"]
      },
      {
        title: "Call Emergency Services",
        description: "Call 911 immediately for serious emergencies. Provide location, emergency nature, and victim count.",
        important: true,
        duration: "1-2 minutes",
        tips: ["Be clear and specific", "Stay on line", "Follow dispatcher instructions"]
      },
      {
        title: "Provide Appropriate Care",
        description: "Follow standard first aid protocols for the specific emergency. Monitor victim until professional help arrives.",
        important: true,
        duration: "Until EMS arrives",
        tips: ["Work within your training", "Monitor continuously", "Reassure victim"]
      }
    ],
    warnings: protocolWarnings[id] || ["Always ensure your safety first", "Call emergency services when in doubt", "Don't exceed your training level"],
    notes: protocolNotes[id] || ["This protocol should be performed by trained individuals when possible", "Regular first aid training is recommended"],
    quickTips: quickTips[id] || ["Stay calm", "Act quickly but safely", "Call for professional help"]
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

      {/* Quick Reference */}
      {protocol.quickTips && (
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
            <Shield className="w-6 h-6 mr-3 text-green-600" />
            Quick Reference
          </h2>
          <div className="bg-green-50 border border-green-200 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {protocol.quickTips.map((tip, index) => (
                <div key={index} className="flex items-start">
                  <div className="flex-shrink-0 w-6 h-6 bg-green-500 text-white rounded-full flex items-center justify-center text-sm font-bold mr-3">
                    {index + 1}
                  </div>
                  <span className="text-green-800 font-medium">{tip}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Protocol Steps */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
          <BookOpen className="w-6 h-6 mr-3 text-primary" />
          Step-by-Step Instructions
        </h2>
        
        <div className="space-y-6">
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
                <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white font-bold mr-4 ${
                  step.important ? "bg-red-500" : "bg-gray-500"
                }`}>
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{step.title}</h3>
                    {step.duration && (
                      <div className="flex items-center text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded">
                        <Clock className="w-4 h-4 mr-1" />
                        {step.duration}
                      </div>
                    )}
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">{step.description}</p>
                  
                  {step.tips && step.tips.length > 0 && (
                    <div className="mt-3">
                      <h4 className="text-sm font-semibold text-gray-700 mb-2">Key Points:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="text-sm text-gray-600">{tip}</li>
                        ))}
                      </ul>
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
            Critical Warnings
          </h2>
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <ul className="space-y-3">
              {protocol.warnings.map((warning, index) => (
                <li key={index} className="flex items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
                  <span className="text-red-700 font-medium">{warning}</span>
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
            Additional Information
          </h2>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <ul className="space-y-3">
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