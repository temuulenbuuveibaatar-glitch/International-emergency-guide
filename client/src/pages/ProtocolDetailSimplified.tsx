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
  FileVideo,
  ImageIcon,
  ExternalLink
} from "lucide-react";
import MultimediaButton from "../components/MultimediaButton";
import { Button } from "../components/ui/button";

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
  demoVideo?: string; // URL to a main demo video for the entire protocol
  demoImages?: string[]; // URLs to demo images for the entire protocol
}

// This function would normally fetch data from an API
const getProtocolById = (id: string): Protocol | null => {
  // Extended protocols with multimedia content
  const protocolData: Record<string, Protocol> = {
    "cpr": {
      id: "cpr",
      title: "CPR Protocol",
      description: "Step-by-step guide for cardiopulmonary resuscitation in emergency situations.",
      demoVideo: "https://www.youtube.com/watch?v=XpEvQuOWME0",
      demoImages: [
        "https://www.mayoclinic.org/-/media/kcms/gbs/patient-consumer/images/2017/10/05/17/43/cpr-8col.jpg",
        "https://www.redcross.org/content/dam/redcross/uncategorized/6/Hands-Only-CPR-Steps.png.transform/1288/q70/feature/image.jpeg",
        "https://healthmatters.nyp.org/wp-content/uploads/2018/06/hands-on-cpr-1.jpg"
      ],
      steps: [
        {
          title: "Check Responsiveness",
          description: "Tap the person's shoulder and shout 'Are you okay?' to ensure they're unconscious.",
          imageUrl: "https://cpr.heart.org/-/media/Images/Health-Topics/CPR/CPR_Check_for_Responsiveness.png"
        },
        {
          title: "Call for Help",
          description: "Ask someone to call emergency services (103 in Mongolia) and get an AED if available.",
          important: true,
          imageUrl: "https://www.verywellhealth.com/thmb/M0pMrTdcStQmrpPSOXn9lp1pjWA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-675680446-5a8cd329c5542e003743880f.jpg"
        },
        {
          title: "Check Breathing",
          description: "Look for chest movement, listen for breathing sounds, and feel for breath on your cheek for no more than 10 seconds.",
          videoUrl: "https://www.youtube.com/watch?v=f4ZI1PAsmks"
        },
        {
          title: "Begin Chest Compressions",
          description: "Place the heel of your hand on the center of the chest, place your other hand on top, position your shoulders above your hands, and push hard and fast at a rate of 100-120 compressions per minute. Allow the chest to completely recoil between compressions.",
          important: true,
          videoUrl: "https://www.youtube.com/watch?v=pk53b_eweyk"
        },
        {
          title: "Open the Airway",
          description: "Place one hand on the forehead and gently tilt the head back. With your other hand, lift the chin forward to open the airway.",
          imageUrl: "https://www.thecprguys.com/wp-content/uploads/2019/02/The-Head-Tilt-Chin-Lift-Maneuver-for-Airway-Opening.jpg"
        },
        {
          title: "Give Rescue Breaths",
          description: "Pinch the nose closed, take a normal breath, cover the person's mouth with yours (or use a barrier device), and blow for about 1 second to make the chest rise. Deliver 2 rescue breaths.",
          imageUrl: "https://userfiles.steadyhealth.com/articles/info/5/55/rescue-breathing.jpg"
        },
        {
          title: "Continue CPR",
          description: "Continue cycles of 30 chest compressions followed by 2 rescue breaths until help arrives or the person shows signs of life.",
          videoUrl: "https://www.youtube.com/watch?v=hizBdM1Ob68"
        },
        {
          title: "Use AED if Available",
          description: "Turn on the AED and follow the prompts. Apply pads to bare chest as shown in the diagram on the pads.",
          imageUrl: "https://www.heartsafesolution.com/wp-content/uploads/2018/10/pad-where-to-place-aed-pads1.jpg",
          videoUrl: "https://www.youtube.com/watch?v=UFvL7wTFzl0"
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
      demoVideo: "https://www.youtube.com/watch?v=PA9hpOnvtCk",
      demoImages: [
        "https://www.mayoclinic.org/-/media/kcms/gbs/patient-consumer/images/2016/10/07/18/03/heimlich-maneuver-8col.jpg",
        "https://aedusa.com/sites/default/files/inline-images/Heimlich%20choking.jpg",
        "https://www.redcross.org.uk/getmedia/3e794c60-f98f-4e12-8ab7-8f8a66ab4587/Adult-choking.jpgmaxwh=603",
      ],
      steps: [
        {
          title: "Assess the Severity",
          description: "Determine if the airway is completely or partially blocked. If the person can speak, cough, or breathe, do not interfere.",
          imageUrl: "https://thumbs.dreamstime.com/b/universal-choking-sign-symbol-vector-illustration-international-signal-indicates-person-cannot-speak-breathe-needs-immediate-177597219.jpg"
        },
        {
          title: "Call for Help",
          description: "If the person cannot speak, cough, or breathe, call for emergency services (103 in Mongolia) or have someone else call.",
          important: true,
          imageUrl: "https://www.verywellhealth.com/thmb/M0pMrTdcStQmrpPSOXn9lp1pjWA=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/GettyImages-675680446-5a8cd329c5542e003743880f.jpg"
        },
        {
          title: "Heimlich Maneuver (Abdominal Thrusts)",
          description: "Stand behind the person and wrap your arms around their waist. Make a fist with one hand and place it just above their navel. Grasp your fist with your other hand and press into their abdomen with quick upward thrusts.",
          important: true,
          videoUrl: "https://www.youtube.com/watch?v=2dn13zneEjo"
        },
        {
          title: "Continue Until Object Is Expelled",
          description: "Repeat abdominal thrusts until the object is expelled or the person loses consciousness.",
          imageUrl: "https://www.emssafetyservices.com/wp-content/uploads/2016/11/new-heimlich.jpg"
        },
        {
          title: "If the Person Becomes Unconscious",
          description: "Lower the person carefully to the ground and begin CPR, starting with chest compressions. Before giving breaths, look in the mouth for the object. If you see it, remove it, but never perform blind finger sweeps.",
          videoUrl: "https://www.youtube.com/watch?v=UAcRa5IJU1I"
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
    }
  };
  
  // Try to find protocol in the protocolData (for CPR and Choking with multimedia)
  if (protocolData[id]) {
    return protocolData[id];
  }
  
  // Otherwise look in emergencyProtocols (for other protocols)
  const protocol = emergencyProtocols.find(p => p.id === id);
  if (protocol) {
    // Make sure it has steps property
    return {
      ...protocol,
      steps: (protocol as any).steps || [{
        title: "Information",
        description: protocol.description
      }]
    };
  }
  
  return null;
};

export default function ProtocolDetail() {
  const { t } = useTranslation();
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : "";
  const [protocol, setProtocol] = useState<Protocol | null>(null);

  useEffect(() => {
    const protocolData = getProtocolById(id);
    setProtocol(protocolData);
  }, [id]);

  if (!protocol) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Link href="/emergency-protocols" className="text-blue-600 hover:text-blue-800 flex items-center">
            <ArrowLeft size={20} className="mr-2" />
            {t('protocols.backToList', 'Back to all protocols')}
          </Link>
        </div>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">{t('protocols.notFound', 'Protocol Not Found')}</h2>
          <p className="text-gray-600">{t('protocols.protocolNotFound', 'The emergency protocol you requested could not be found.')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex items-center mb-6">
        <Link href="/emergency-protocols" className="text-blue-600 hover:text-blue-800 flex items-center">
          <ArrowLeft size={20} className="mr-2" />
          {t('protocols.backToList', 'Back to all protocols')}
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">{protocol.title}</h1>
          <p className="text-gray-600 mb-6">{protocol.description}</p>

          <div className="flex flex-wrap gap-2 mb-6">
            <Button variant="outline" size="sm" className="flex items-center">
              <Printer size={16} className="mr-1" />
              {t('protocols.print', 'Print')}
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Share2 size={16} className="mr-1" />
              {t('protocols.share', 'Share')}
            </Button>
            <Button variant="outline" size="sm" className="flex items-center">
              <Bookmark size={16} className="mr-1" />
              {t('protocols.save', 'Save')}
            </Button>
          </div>

          {/* Main Demo Video */}
          {protocol.demoVideo && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <FileVideo size={20} className="mr-2 text-red-600" />
                {t('protocols.demoVideo', 'Demonstration Video')}
              </h2>
              <div className="border border-gray-200 rounded-lg p-3 bg-gray-50">
                <MultimediaButton 
                  url={protocol.demoVideo} 
                  type="video" 
                  title={`Watch demonstration video for ${protocol.title}`}
                />
              </div>
            </div>
          )}

          {/* Demo Images */}
          {protocol.demoImages && protocol.demoImages.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <ImageIcon size={20} className="mr-2 text-blue-600" />
                {t('protocols.demoImages', 'Visual Guides')}
              </h2>
              <div className="space-y-2 border border-gray-200 rounded-lg p-3 bg-gray-50">
                {protocol.demoImages.map((imageUrl, index) => (
                  <MultimediaButton 
                    key={index}
                    url={imageUrl} 
                    type="image" 
                    title={`View visual guide #${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Steps */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
              <Info size={20} className="mr-2 text-blue-600" />
              {t('protocols.stepByStep', 'Step-by-Step Instructions')}
            </h2>
            <div className="space-y-6">
              {protocol.steps.map((step, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-lg ${step.important ? 'bg-yellow-50 border border-yellow-200' : 'bg-gray-50 border border-gray-200'}`}
                >
                  <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center mr-2 flex-shrink-0">
                      {index + 1}
                    </span>
                    {step.title}
                    {step.important && (
                      <span className="ml-2 inline-flex items-center bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded-full">
                        <AlertTriangle size={12} className="mr-1" />
                        Important
                      </span>
                    )}
                  </h3>
                  <p className="text-gray-700 mb-4">{step.description}</p>
                  
                  <div className="space-y-2">
                    {step.videoUrl && (
                      <MultimediaButton 
                        url={step.videoUrl} 
                        type="video" 
                        title={`Watch tutorial: ${step.title}`}
                      />
                    )}
                    
                    {step.imageUrl && (
                      <MultimediaButton 
                        url={step.imageUrl} 
                        type="image" 
                        title={`View illustration: ${step.title}`}
                      />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Warnings */}
          {protocol.warnings && protocol.warnings.length > 0 && (
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <AlertTriangle size={20} className="mr-2 text-red-600" />
                {t('protocols.warnings', 'Important Warnings')}
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  {protocol.warnings.map((warning, index) => (
                    <li key={index}>{warning}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Notes */}
          {protocol.notes && protocol.notes.length > 0 && (
            <div className="mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-4 flex items-center">
                <Info size={20} className="mr-2 text-green-600" />
                {t('protocols.additionalNotes', 'Additional Notes')}
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <ul className="list-disc list-inside space-y-2 text-gray-800">
                  {protocol.notes.map((note, index) => (
                    <li key={index}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Additional Resources */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center">
              <BookOpen size={20} className="mr-2 text-blue-600" />
              {t('protocols.additionalResources', 'Additional Resources')}
            </h2>
            <p className="text-gray-700 mb-3">
              {t('protocols.resourcesDesc', 'For more detailed information and official guidance, please visit these resources:')}
            </p>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://www.redcross.org/get-help/how-to-prepare-for-emergencies.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={16} className="mr-2" />
                  Red Cross Emergency Preparedness
                </a>
              </li>
              <li>
                <a 
                  href="https://www.who.int/health-topics/emergency-care" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center text-blue-600 hover:text-blue-800"
                >
                  <ExternalLink size={16} className="mr-2" />
                  World Health Organization (WHO) Emergency Care
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}