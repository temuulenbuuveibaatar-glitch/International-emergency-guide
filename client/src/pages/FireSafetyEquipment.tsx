import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FiInfo, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";
import Layout from "../components/Layout";

interface EquipmentItem {
  id: string;
  name: string;
  description: string;
  useCases: string[];
  maintenanceTips: string[];
  safetyTips: string[];
  imageUrl?: string;
}

export default function FireSafetyEquipment() {
  const { t } = useTranslation();
  
  const equipmentItems: EquipmentItem[] = [
    {
      id: "extinguisher",
      name: "Fire Extinguishers",
      description: "Portable devices used to suppress small fires by releasing an extinguishing agent that removes either the heat, oxygen, or chemical chain reaction from the fire tetrahedron.",
      useCases: [
        "Class A fires: Ordinary combustibles like wood, paper, and cloth",
        "Class B fires: Flammable liquids like oil, gasoline, and grease",
        "Class C fires: Electrical equipment",
        "Class D fires: Combustible metals (specialized extinguishers only)",
        "Class K fires: Kitchen fires involving cooking oils and fats"
      ],
      maintenanceTips: [
        "Monthly visual inspection: Check pressure gauge, examine for damage",
        "Professional inspection annually",
        "Replace or recharge after any use",
        "Follow manufacturer's recommendations for replacement (typically 5-15 years)",
        "Keep accessible and unobstructed"
      ],
      safetyTips: [
        "Only attempt to fight small, contained fires",
        "Always position yourself with an exit behind you",
        "Use the PASS technique: Pull, Aim, Squeeze, Sweep",
        "Stay 6-8 feet away from the fire",
        "If the fire grows, evacuate immediately"
      ]
    },
    {
      id: "alarms",
      name: "Smoke Alarms & Detectors",
      description: "Life-saving devices that provide early warning of smoke or fire, giving occupants critical time to evacuate or respond to emergencies before they become catastrophic.",
      useCases: [
        "Residential installations in bedrooms, hallways, and every floor level",
        "Commercial buildings as part of integrated fire systems",
        "Early detection of smoldering fires",
        "Integration with smart home systems for remote monitoring",
        "Alerting occupants during sleeping hours when sense of smell is diminished"
      ],
      maintenanceTips: [
        "Test monthly using the test button",
        "Replace batteries annually (unless using 10-year sealed units)",
        "Replace entire unit every 10 years",
        "Clean regularly to remove dust and debris",
        "Keep free from paint and avoid covering with decorations"
      ],
      safetyTips: [
        "Install on every level of the home",
        "Place inside each bedroom and outside sleeping areas",
        "Interconnect alarms when possible so when one sounds, they all sound",
        "For hearing-impaired individuals, use models with strobe lights or bed shakers",
        "Never disable alarms, even during false alarms (fix the problem instead)"
      ]
    },
    {
      id: "sprinklers",
      name: "Fire Sprinkler Systems",
      description: "Automatic fire suppression systems that discharge water when the heat of a fire activates the sprinkler head, providing immediate response to contain fires at their point of origin.",
      useCases: [
        "Residential protection especially in kitchens, living areas, and bedrooms",
        "Commercial buildings to protect property and ensure business continuity",
        "Hotels and dormitories to protect sleeping occupants",
        "High-rise buildings where evacuation is complicated",
        "Healthcare facilities where patient evacuation is difficult"
      ],
      maintenanceTips: [
        "Professional inspection annually",
        "Avoid painting or damaging sprinkler heads",
        "Never hang items from sprinkler heads or pipes",
        "Keep water supply valves open and unobstructed",
        "Test water flow alarm quarterly (professional service)"
      ],
      safetyTips: [
        "Each sprinkler activates individually - only those near the fire will discharge",
        "Modern residential sprinklers are designed to blend with décor",
        "Maintain 18 inches of clearance below sprinkler heads",
        "Report leaking or damaged sprinklers immediately",
        "Understand that sprinklers significantly reduce fire deaths and property damage"
      ]
    },
    {
      id: "blankets",
      name: "Fire Blankets",
      description: "Sheets of fire-resistant material that can be used to smother small fires or wrap around a person whose clothing has caught fire, depriving the fire of oxygen.",
      useCases: [
        "Small kitchen fires, especially grease fires",
        "Wrapping around a person whose clothes are on fire",
        "Laboratory and workshop small fire containment",
        "Alternative to fire extinguishers for certain small fires",
        "Covering flammable materials during welding or similar operations"
      ],
      maintenanceTips: [
        "Store in easily accessible location, preferably mounted on wall",
        "Keep in original container until needed",
        "Inspect packaging regularly for damage",
        "Replace after any use",
        "Replace according to manufacturer's guidelines, typically every 5 years"
      ],
      safetyTips: [
        "Pull tabs to release blanket from container",
        "Shield hands with blanket while applying",
        "Apply from front to back over flames",
        "Leave in place until the area has completely cooled",
        "Do not reuse after extinguishing a fire"
      ]
    },
    {
      id: "escape",
      name: "Emergency Escape Equipment",
      description: "Vital tools that provide alternative escape routes during fires when primary exits are blocked, including escape ladders, emergency window hammers, and escape masks.",
      useCases: [
        "Multi-story buildings when stairways are compromised",
        "Upper floor bedrooms as secondary evacuation route",
        "Breaking safety glass when necessary during emergencies",
        "Filtering toxic smoke during evacuation",
        "Providing short-term respiratory protection"
      ],
      maintenanceTips: [
        "Store near windows or evacuation points",
        "Inspect regularly for damage or wear",
        "Test deployment mechanisms periodically (if applicable)",
        "Replace any equipment showing signs of deterioration",
        "Ensure all family members know the location and proper use"
      ],
      safetyTips: [
        "Practice using escape equipment before an emergency (from ground floor for ladders)",
        "Ensure that escape ladders match the height requirements of your building",
        "Consider escape hoods or masks with smoke filtering capabilities",
        "Keep escape routes clear of furniture and obstacles",
        "Have a designated meeting point outside after evacuation"
      ]
    },
    {
      id: "signage",
      name: "Emergency Signage & Lighting",
      description: "Critical visual guidance systems that remain operational during power failures, helping occupants locate exits and evacuation routes in smoke-filled or darkened environments.",
      useCases: [
        "Marking emergency exits and evacuation routes",
        "Illuminating stairwells and corridors during power failures",
        "Indicating location of fire fighting equipment",
        "Providing directional guidance in smoke-filled environments",
        "Supporting evacuation in unfamiliar buildings"
      ],
      maintenanceTips: [
        "Test emergency lighting monthly",
        "Professional inspection annually",
        "Replace batteries according to manufacturer's guidelines",
        "Clean light covers to maintain brightness",
        "Ensure signs remain visible and unobstructed"
      ],
      safetyTips: [
        "Photoluminescent signs provide guidance even without electricity",
        "Familiarize yourself with exit signs and evacuation routes before emergencies",
        "Low-level lighting is often more visible under smoke conditions",
        "In public buildings, follow illuminated exit signs, not the way you entered",
        "Signs with directional arrows indicate the nearest exit route"
      ]
    },
    {
      id: "personal",
      name: "Personal Protective Equipment",
      description: "Specialized gear designed to protect individuals from fire, smoke, and heat during emergency situations, including fire-resistant clothing, gloves, and respiratory protection.",
      useCases: [
        "Emergency evacuation through smoke-filled areas",
        "Short-term protection during escape",
        "Protection for emergency responders and fire wardens",
        "Industrial settings with fire hazards",
        "Kitchen and laboratory fire protection"
      ],
      maintenanceTips: [
        "Store in accessible location",
        "Inspect for damage or wear regularly",
        "Follow manufacturer's cleaning guidelines",
        "Replace when damaged or after exposure to fire",
        "Check expiration dates on respirators and filters"
      ],
      safetyTips: [
        "Fire-resistant clothing provides temporary protection only",
        "Smoke hoods typically provide 15-30 minutes of filtered air",
        "Heat-resistant gloves protect hands during evacuation",
        "Respirators should be properly fitted for effectiveness",
        "PPE supplements evacuation plans, not replaces them"
      ]
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto py-6">
        <h1 className="text-3xl font-bold mb-6">Fire Safety Equipment Guide</h1>
        
        <div className="mb-8 bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h2 className="flex items-center text-xl font-semibold text-amber-800 mb-2">
            <FiInfo className="mr-2" /> Important Information
          </h2>
          <p className="text-amber-700">
            This guide provides essential information about various fire safety equipment, their uses, maintenance, and safety tips. 
            Having the right equipment in good working condition is crucial for fire prevention and effective emergency response.
          </p>
        </div>

        <Tabs defaultValue="extinguisher" className="w-full">
          <TabsList className="flex flex-wrap mb-4">
            {equipmentItems.map((item) => (
              <TabsTrigger key={item.id} value={item.id} className="mb-1">
                {item.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {equipmentItems.map((item) => (
            <TabsContent key={item.id} value={item.id} className="mt-0">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-bold mb-3">{item.name}</h2>
                  <p className="text-gray-700 mb-6">{item.description}</p>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                      <h3 className="flex items-center text-lg font-semibold text-blue-800 mb-3">
                        <FiInfo className="mr-2" /> Common Uses
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {item.useCases.map((use, index) => (
                          <li key={index} className="text-blue-700">{use}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                      <h3 className="flex items-center text-lg font-semibold text-green-800 mb-3">
                        <FiCheckCircle className="mr-2" /> Maintenance Tips
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {item.maintenanceTips.map((tip, index) => (
                          <li key={index} className="text-green-700">{tip}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                      <h3 className="flex items-center text-lg font-semibold text-red-800 mb-3">
                        <FiAlertTriangle className="mr-2" /> Safety Tips
                      </h3>
                      <ul className="list-disc pl-5 space-y-2">
                        {item.safetyTips.map((tip, index) => (
                          <li key={index} className="text-red-700">{tip}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Fire Safety Equipment Planning</h2>
          <p className="mb-4">
            When planning your fire safety equipment setup, consider these factors:
          </p>
          <ul className="list-disc pl-6 space-y-2 mb-4">
            <li>Building size and layout</li>
            <li>Occupancy type and number of people</li>
            <li>Types of potential fire hazards present</li>
            <li>Local fire codes and regulations</li>
            <li>Accessibility needs of occupants</li>
            <li>Budget constraints vs. safety requirements</li>
          </ul>
          <p className="mb-4">
            For the most effective protection, consult with a fire safety professional who can evaluate your specific needs
            and provide recommendations tailored to your situation.
          </p>
          <Button className="mt-2">
            Find Fire Safety Professionals
          </Button>
        </div>
      </div>
    </Layout>
  );
}