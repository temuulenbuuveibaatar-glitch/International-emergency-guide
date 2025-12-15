import type { TreatmentProtocol } from '../treatmentProtocols';

export interface ProtocolTemplate {
  baseId: string;
  baseName: string;
  category: string;
  baseIcdCodes: string[];
  baseDescription: string;
  baseSeverity: TreatmentProtocol['severity'];
  variants: ProtocolVariant[];
  baseSteps: TreatmentProtocol['steps'];
  baseFirstLineMedications: TreatmentProtocol['firstLineMedications'];
  baseSecondLineMedications?: TreatmentProtocol['secondLineMedications'];
  baseAdjunctiveTreatments?: string[];
  baseContraindications: string[];
  baseWarningSymptoms: string[];
  baseReferralCriteria: string[];
  baseFollowUp: string;
  baseReferences: string[];
}

export interface ProtocolVariant {
  suffix: string;
  nameSuffix: string;
  severity?: TreatmentProtocol['severity'];
  additionalIcdCodes?: string[];
  descriptionPrefix?: string;
  additionalSteps?: TreatmentProtocol['steps'];
  additionalMedications?: TreatmentProtocol['firstLineMedications'];
  additionalWarnings?: string[];
  population?: 'adult' | 'pediatric' | 'geriatric' | 'pregnant';
}

export function generateProtocolsFromTemplate(template: ProtocolTemplate): TreatmentProtocol[] {
  const protocols: TreatmentProtocol[] = [];
  
  for (const variant of template.variants) {
    const populationPrefix = variant.population 
      ? `${variant.population.charAt(0).toUpperCase()}${variant.population.slice(1)} ` 
      : '';
    
    protocols.push({
      id: `${template.baseId}-${variant.suffix}`,
      name: `${populationPrefix}${template.baseName}${variant.nameSuffix}`,
      category: template.category,
      icdCodes: [...template.baseIcdCodes, ...(variant.additionalIcdCodes || [])],
      description: `${variant.descriptionPrefix || ''}${template.baseDescription}`,
      severity: variant.severity || template.baseSeverity,
      steps: [...template.baseSteps, ...(variant.additionalSteps || [])],
      firstLineMedications: template.baseFirstLineMedications,
      secondLineMedications: [...(template.baseSecondLineMedications || []), ...(variant.additionalMedications || [])],
      adjunctiveTreatments: template.baseAdjunctiveTreatments,
      contraindications: template.baseContraindications,
      warningSymptoms: [...template.baseWarningSymptoms, ...(variant.additionalWarnings || [])],
      referralCriteria: template.baseReferralCriteria,
      followUp: template.baseFollowUp,
      references: template.baseReferences,
      lastUpdated: new Date().toISOString().split('T')[0]
    });
  }
  
  return protocols;
}

export function generateSeverityVariants(
  baseProtocol: Omit<TreatmentProtocol, 'id' | 'severity' | 'lastUpdated'>,
  severities: Array<{ severity: TreatmentProtocol['severity']; suffix: string; modifications?: Partial<TreatmentProtocol> }>
): TreatmentProtocol[] {
  return severities.map(s => ({
    ...baseProtocol,
    id: `${baseProtocol.name.toLowerCase().replace(/\s+/g, '-')}-${s.suffix}`,
    severity: s.severity,
    ...s.modifications,
    lastUpdated: new Date().toISOString().split('T')[0]
  }));
}

export function generateAgeGroupVariants(
  baseProtocol: Omit<TreatmentProtocol, 'id' | 'lastUpdated'>,
  ageGroups: Array<{ group: string; suffix: string; doseModifier?: string; additionalNotes?: string[] }>
): TreatmentProtocol[] {
  return ageGroups.map(ag => ({
    ...baseProtocol,
    id: `${baseProtocol.name.toLowerCase().replace(/\s+/g, '-')}-${ag.suffix}`,
    name: `${ag.group} ${baseProtocol.name}`,
    description: `${ag.group}-specific: ${baseProtocol.description}`,
    firstLineMedications: baseProtocol.firstLineMedications.map(med => ({
      ...med,
      notes: med.notes ? `${med.notes} (${ag.group} dosing)` : `${ag.group} dosing applies`
    })),
    lastUpdated: new Date().toISOString().split('T')[0]
  }));
}
