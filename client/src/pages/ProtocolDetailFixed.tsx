import { useParams } from "wouter";
import { useTranslation } from "react-i18next";
import { ArrowLeft, AlertTriangle, Clock, CheckCircle, AlertCircle, Lightbulb, BookOpen } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { emergencyProtocols } from "@/data/protocols";

export default function ProtocolDetail() {
  const { id } = useParams();
  const { t } = useTranslation();

  const protocol = emergencyProtocols.find(p => p.id === id);

  if (!protocol) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="border-red-300 bg-red-50">
            <CardContent className="p-8 text-center">
              <AlertTriangle className="mx-auto mb-4 text-red-600" size={48} />
              <h2 className="text-2xl font-bold text-red-800 mb-2">Protocol Not Found</h2>
              <p className="text-red-600 mb-4">The requested emergency protocol could not be found.</p>
              <Button
                onClick={() => window.history.back()}
                variant="outline"
                className="border-red-300 text-red-700 hover:bg-red-100"
              >
                <ArrowLeft size={16} className="mr-2" />
                Return to Protocols
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Comprehensive protocol data for detailed protocols
  const comprehensiveProtocols: Record<string, Array<{ title: string; description: string; important: boolean; duration: string; tips: string[]; }>> = {
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

  // Quick tips
  const quickTips: Record<string, string[]> = {
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
    ]
  };

  // Check if this protocol has comprehensive steps
  const comprehensiveSteps = comprehensiveProtocols[id || ""];
  const tips = quickTips[id || ""] || [];

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
          
          {comprehensiveSteps ? (
            comprehensiveSteps.map((step, index) => (
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
            ))
          ) : (
            <Card className="border-gray-300 bg-gray-50">
              <CardContent className="p-8 text-center">
                <BookOpen className="mx-auto mb-4 text-gray-600" size={48} />
                <h3 className="text-xl font-bold text-gray-800 mb-2">Protocol Information</h3>
                <p className="text-gray-600">Detailed step-by-step procedures for this protocol are being updated.</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="text-center">
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