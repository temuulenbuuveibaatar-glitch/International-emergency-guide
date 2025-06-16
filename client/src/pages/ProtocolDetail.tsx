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
      "Don't wait for 'classic' symptoms",
      "Chew aspirin for faster absorption",
      "EMS provides better outcomes than driving"
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