
export interface PlanSection {
    title: string;
    content: string;
}

export interface Plan {
    analysis: PlanSection;
    flows: PlanSection;
    stack: PlanSection;
    implementation: PlanSection;
    roi: PlanSection;
    expenses: PlanSection;
}

export interface GroundingSource {
    uri: string;
    title: string;
}

export interface SavedPlan extends Plan {
    id: string;
    createdAt: number;
    businessDescription: string;
    niche: string;
    solutionType: string;
    sources: GroundingSource[];
}

export interface ChatMessage {
    role: 'user' | 'model';
    content: string;
}
