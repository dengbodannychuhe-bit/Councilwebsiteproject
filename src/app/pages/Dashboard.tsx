import { useProjects } from '../context/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { 
  FolderOpen, 
  AlertTriangle, 
  AlertCircle, 
  Target, 
  TrendingUp,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { Link } from 'react-router';

export function Dashboard() {
  const { projects } = useProjects();

  // Calculate statistics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const totalRisks = projects.reduce((acc, p) => acc + p.risks.length, 0);
  const openRisks = projects.reduce((acc, p) => acc + p.risks.filter(r => r.status === 'Open').length, 0);
  const totalIssues = projects.reduce((acc, p) => acc + p.issues.length, 0);
  const openIssues = projects.reduce((acc, p) => acc + p.issues.filter(i => i.status === 'Open').length, 0);
  const totalBenefits = projects.reduce((acc, p) => acc + p.benefits.length, 0);
  const achievedBenefits = projects.reduce((acc, p) => acc + p.benefits.filter(b => b.status === 'Achieved').length, 0);
  const totalMilestones = projects.reduce((acc, p) => acc + p.grantMilestones.length, 0);
  const completedMilestones = projects.reduce((acc, p) => acc + p.grantMilestones.filter(m => m.status === 'Completed').length, 0);

  const stats = [
    {
      title: 'Total Projects',
      value: totalProjects,
      subtitle: `${activeProjects} active, ${completedProjects} completed`,
      icon: FolderOpen,
      color: '#006FB9',
      bgColor: 'var(--council-blue-light)'
    },
    {
      title: 'Open Risks',
      value: openRisks,
      subtitle: `${totalRisks} total risks tracked`,
      icon: AlertTriangle,
      color: '#F4721E',
      bgColor: 'var(--council-orange-light)'
    },
    {
      title: 'Open Issues',
      value: openIssues,
      subtitle: `${totalIssues} total issues logged`,
      icon: AlertCircle,
      color: '#DC2626',
      bgColor: '#FEF2F2'
    },
    {
      title: 'Benefits Tracking',
      value: `${achievedBenefits}/${totalBenefits}`,
      subtitle: 'Benefits achieved',
      icon: Target,
      color: '#50B66D',
      bgColor: 'var(--council-green-light)'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800';
      case 'Planning':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'Completed':
        return 'bg-gray-100 text-gray-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-100 text-red-800';
      case 'High':
        return 'bg-orange-100 text-orange-800';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'Low':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-600 mt-2">Overview of all council projects and activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    <p className="text-sm text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className="p-3 rounded-lg" style={{ backgroundColor: stat.bgColor }}>
                    <Icon className="w-6 h-6" style={{ color: stat.color }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card style={{ backgroundColor: 'var(--council-blue-light)' }} className="border-[var(--council-blue)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: 'var(--council-blue)' }} />
              Grant Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Completed</span>
                <span className="text-2xl font-bold text-gray-900">{completedMilestones}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total</span>
                <span className="text-xl text-gray-700">{totalMilestones}</span>
              </div>
              <div className="mt-4 pt-4 border-t">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="h-2 rounded-full transition-all"
                    style={{
                      width: `${totalMilestones > 0 ? (completedMilestones / totalMilestones) * 100 : 0}%`,
                      backgroundColor: 'var(--council-blue)'
                    }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  {totalMilestones > 0 ? Math.round((completedMilestones / totalMilestones) * 100) : 0}% complete
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: 'var(--council-green-light)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: 'var(--council-green)' }} />
              Project Status Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Active', 'Planning', 'On Hold', 'Completed'].map(status => {
                const count = projects.filter(p => p.status === status).length;
                return (
                  <div key={status} className="flex justify-between items-center">
                    <span className="text-gray-600">{status}</span>
                    <Badge className={getStatusColor(status)}>{count}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Projects */}
      <Card style={{ backgroundColor: 'var(--council-purple-light)' }} className="border-[var(--council-purple)]">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Active Projects</span>
            <Link to="/projects">
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                View All
              </Badge>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {projects.filter(p => p.status === 'Active').map(project => (
              <Link 
                key={project.id} 
                to={`/projects/${project.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">{project.name}</h3>
                      <Badge className={getPriorityColor(project.priority)}>
                        {project.priority}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                      <span>PM: {project.projectManager}</span>
                      <span>•</span>
                      <span>{project.department}</span>
                      <span>•</span>
                      <span>Budget: {project.budget}</span>
                    </div>
                  </div>
                  <Badge className={getStatusColor(project.status)}>
                    {project.status}
                  </Badge>
                </div>
              </Link>
            ))}
            {projects.filter(p => p.status === 'Active').length === 0 && (
              <p className="text-gray-500 text-center py-8">No active projects</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
