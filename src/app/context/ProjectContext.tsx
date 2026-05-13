import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Project, GrantMilestone } from '../types/project';

interface ProjectContextType {
  projects: Project[];
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  getProject: (id: string) => Project | undefined;
  addMilestone: (projectId: string, milestone: GrantMilestone) => void;
}

const ProjectContext = createContext<ProjectContextType | undefined>(undefined);

// Mock data for initial projects
const mockProjects: Project[] = [
  {
    id: '1',
    name: 'Community Centre Renovation',
    description: 'Complete renovation of the downtown community centre including accessibility improvements',
    status: 'Active',
    priority: 'High',
    phase: 'Execution',
    startDate: '2026-01-15',
    endDate: '2026-08-30',
    budget: '$2,500,000',
    projectManager: 'Sarah Johnson',
    department: 'Community Services',
    risks: [
      {
        id: 'r1',
        title: 'Asbestos Discovery',
        description: 'Potential asbestos in old building materials',
        likelihood: 'Medium',
        impact: 'High',
        mitigation: 'Complete asbestos survey before demolition work',
        status: 'Open',
        owner: 'Sarah Johnson',
        dateIdentified: '2026-02-01'
      }
    ],
    issues: [
      {
        id: 'i1',
        title: 'Permit Delay',
        description: 'Building permit approval delayed by 2 weeks',
        priority: 'High',
        status: 'Resolved',
        assignedTo: 'Mike Chen',
        dateRaised: '2026-02-10',
        dateResolved: '2026-02-24'
      }
    ],
    scopeChanges: [
      {
        id: 's1',
        title: 'Add Solar Panels',
        description: 'Include solar panel installation on roof',
        requestedBy: 'Environmental Committee',
        dateRequested: '2026-02-15',
        status: 'Approved',
        impact: 'Additional 3 weeks to timeline',
        costImpact: '+$150,000',
        timelineImpact: '+3 weeks'
      }
    ],
    benefits: [
      {
        id: 'b1',
        title: 'Increased Accessibility',
        description: 'Provide wheelchair access to all areas',
        category: 'Social',
        targetValue: '100% accessibility compliance',
        currentValue: '60% complete',
        status: 'In Progress'
      },
      {
        id: 'b2',
        title: 'Energy Cost Savings',
        description: 'Reduced annual energy costs through improvements',
        category: 'Financial',
        targetValue: '$30,000/year savings',
        currentValue: '$0/year',
        status: 'Not Started'
      }
    ],
    grantMilestones: [
      {
        id: 'g1',
        title: 'Phase 1 Completion',
        description: 'Complete demolition and structural work',
        dueDate: '2026-04-30',
        status: 'In Progress',
        deliverables: ['Demolition report', 'Structural certification', 'Safety inspection'],
        grantAmount: '$500,000'
      }
    ]
  },
  {
    id: '2',
    name: 'Park Improvement Program',
    description: 'Upgrade playground equipment and facilities across 5 local parks',
    status: 'Planning',
    priority: 'Medium',
    phase: 'Planning',
    startDate: '2026-04-01',
    endDate: '2026-10-31',
    budget: '$850,000',
    projectManager: 'David Martinez',
    department: 'Parks & Recreation',
    risks: [],
    issues: [],
    scopeChanges: [],
    benefits: [
      {
        id: 'b3',
        title: 'Improved Community Health',
        description: 'Better recreational facilities for residents',
        category: 'Social',
        targetValue: '25% increase in park usage',
        currentValue: 'N/A',
        status: 'Not Started'
      }
    ],
    grantMilestones: []
  },
  {
    id: '3',
    name: 'Digital Services Platform',
    description: 'Launch new online platform for council services and payments',
    status: 'Active',
    priority: 'Critical',
    phase: 'Monitoring',
    startDate: '2026-01-01',
    endDate: '2026-06-30',
    budget: '$1,200,000',
    projectManager: 'Emily Watson',
    department: 'IT Services',
    risks: [
      {
        id: 'r2',
        title: 'Data Migration Issues',
        description: 'Legacy system data may not transfer cleanly',
        likelihood: 'High',
        impact: 'Critical',
        mitigation: 'Extensive testing and phased migration approach',
        status: 'Open',
        owner: 'Emily Watson',
        dateIdentified: '2026-01-10'
      }
    ],
    issues: [
      {
        id: 'i2',
        title: 'Vendor Response Time',
        description: 'Third-party vendor slow to respond to support requests',
        priority: 'Medium',
        status: 'Open',
        assignedTo: 'Tom Anderson',
        dateRaised: '2026-03-15'
      }
    ],
    scopeChanges: [],
    benefits: [
      {
        id: 'b4',
        title: 'Reduced Administrative Costs',
        description: 'Automation of manual processes',
        category: 'Operational',
        targetValue: '$200,000/year savings',
        currentValue: '$0/year',
        status: 'In Progress'
      }
    ],
    grantMilestones: [
      {
        id: 'g2',
        title: 'Beta Launch',
        description: 'Launch beta version to select users',
        dueDate: '2026-05-01',
        status: 'In Progress',
        deliverables: ['Beta platform', 'User testing report', 'Security audit'],
        grantAmount: '$400,000'
      }
    ]
  }
];

export function ProjectProvider({ children }: { children: ReactNode }) {
  const [projects, setProjects] = useState<Project[]>(mockProjects);

  const addProject = (project: Project) => {
    setProjects([...projects, project]);
  };

  const updateProject = (id: string, updatedProject: Partial<Project>) => {
    setProjects(projects.map(p => p.id === id ? { ...p, ...updatedProject } : p));
  };

  const deleteProject = (id: string) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const getProject = (id: string) => {
    return projects.find(p => p.id === id);
  };

  const addMilestone = (projectId: string, milestone: GrantMilestone) => {
    setProjects(projects.map(p => p.id === projectId ? { ...p, grantMilestones: [...p.grantMilestones, milestone] } : p));
  };

  return (
    <ProjectContext.Provider value={{ projects, addProject, updateProject, deleteProject, getProject, addMilestone }}>
      {children}
    </ProjectContext.Provider>
  );
}

export function useProjects() {
  const context = useContext(ProjectContext);
  if (context === undefined) {
    throw new Error('useProjects must be used within a ProjectProvider');
  }
  return context;
}