import { useProjects } from '../context/ProjectContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import {
  Briefcase,
  TrendingUp,
  DollarSign,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Target,
  PieChart,
  Activity
} from 'lucide-react';
import { Link } from 'react-router';

export function PortfolioDashboard() {
  const { projects } = useProjects();

  // Calculate portfolio-level metrics
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'Active').length;
  const completedProjects = projects.filter(p => p.status === 'Completed').length;
  const planningProjects = projects.filter(p => p.status === 'Planning').length;
  const onHoldProjects = projects.filter(p => p.status === 'On Hold').length;

  // Calculate budget metrics
  const totalBudget = projects.reduce((acc, p) => {
    const budgetStr = p.budget.replace(/[$,]/g, '');
    return acc + parseFloat(budgetStr);
  }, 0);

  // Risk and issue metrics
  const totalRisks = projects.reduce((acc, p) => acc + p.risks.length, 0);
  const criticalRisks = projects.reduce((acc, p) => 
    acc + p.risks.filter(r => r.impact === 'Critical' && r.status === 'Open').length, 0
  );
  const totalIssues = projects.reduce((acc, p) => acc + p.issues.length, 0);
  const criticalIssues = projects.reduce((acc, p) => 
    acc + p.issues.filter(i => i.priority === 'Critical' && i.status === 'Open').length, 0
  );

  // Benefit metrics
  const totalBenefits = projects.reduce((acc, p) => acc + p.benefits.length, 0);
  const achievedBenefits = projects.reduce((acc, p) => 
    acc + p.benefits.filter(b => b.status === 'Achieved').length, 0
  );

  // Grant milestone metrics
  const totalMilestones = projects.reduce((acc, p) => acc + p.grantMilestones.length, 0);
  const completedMilestones = projects.reduce((acc, p) => 
    acc + p.grantMilestones.filter(m => m.status === 'Completed').length, 0
  );
  const overdueMilestones = projects.reduce((acc, p) => 
    acc + p.grantMilestones.filter(m => m.status === 'Overdue').length, 0
  );

  // Department breakdown
  const departmentCounts = projects.reduce((acc, p) => {
    acc[p.department] = (acc[p.department] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Priority breakdown
  const priorityCounts = projects.reduce((acc, p) => {
    acc[p.priority] = (acc[p.priority] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const portfolioStats = [
    {
      title: 'Total Portfolio Value',
      value: `$${(totalBudget / 1000000).toFixed(1)}M`,
      subtitle: `Across ${totalProjects} projects`,
      icon: DollarSign,
      color: '#50B66D',
      bgColor: 'var(--council-green-light)'
    },
    {
      title: 'Active Projects',
      value: activeProjects,
      subtitle: `${completedProjects} completed`,
      icon: Briefcase,
      color: '#006FB9',
      bgColor: 'var(--council-blue-light)'
    },
    {
      title: 'Critical Risks',
      value: criticalRisks,
      subtitle: `${totalRisks} total risks`,
      icon: AlertTriangle,
      color: '#F4721E',
      bgColor: 'var(--council-orange-light)'
    },
    {
      title: 'Benefits Achieved',
      value: `${achievedBenefits}/${totalBenefits}`,
      subtitle: `${totalBenefits > 0 ? Math.round((achievedBenefits / totalBenefits) * 100) : 0}% complete`,
      icon: Target,
      color: '#7A298F',
      bgColor: 'var(--council-purple-light)'
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
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'Critical':
        return 'bg-red-500';
      case 'High':
        return 'bg-orange-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-3xl font-bold text-gray-900">Portfolio Dashboard</h2>
        <p className="text-gray-600 mt-2">Executive overview of all council projects and initiatives</p>
      </div>

      {/* Key Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {portfolioStats.map((stat) => {
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

      {/* Portfolio Health & Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Status Distribution */}
        <Card style={{ backgroundColor: 'var(--council-green-light)' }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" style={{ color: 'var(--council-green)' }} />
              Project Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Active</span>
                  <span className="text-sm text-gray-600">{activeProjects} projects</span>
                </div>
                <Progress value={(activeProjects / totalProjects) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Planning</span>
                  <span className="text-sm text-gray-600">{planningProjects} projects</span>
                </div>
                <Progress value={(planningProjects / totalProjects) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Completed</span>
                  <span className="text-sm text-gray-600">{completedProjects} projects</span>
                </div>
                <Progress value={(completedProjects / totalProjects) * 100} className="h-2" />
              </div>
              {onHoldProjects > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">On Hold</span>
                    <span className="text-sm text-gray-600">{onHoldProjects} projects</span>
                  </div>
                  <Progress value={(onHoldProjects / totalProjects) * 100} className="h-2" />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Milestone Progress */}
        <Card style={{ backgroundColor: 'var(--council-blue-light)' }} className="border-[var(--council-blue)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: 'var(--council-blue)' }} />
              Grant Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--council-green)' }} />
                  <span className="text-sm font-medium">Completed</span>
                </div>
                <span className="text-2xl font-bold" style={{ color: 'var(--council-green)' }}>{completedMilestones}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Activity className="w-5 h-5" style={{ color: 'var(--council-blue)' }} />
                  <span className="text-sm font-medium">In Progress</span>
                </div>
                <span className="text-2xl font-bold" style={{ color: 'var(--council-blue)' }}>
                  {totalMilestones - completedMilestones - overdueMilestones}
                </span>
              </div>
              {overdueMilestones > 0 && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium">Overdue</span>
                  </div>
                  <span className="text-2xl font-bold text-red-600">{overdueMilestones}</span>
                </div>
              )}
              <div className="pt-4 border-t">
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
      </div>

      {/* Department & Priority Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Department Distribution */}
        <Card style={{ backgroundColor: 'var(--council-purple-light)' }} className="border-[var(--council-purple)]">
          <CardHeader>
            <CardTitle>Projects by Department</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(departmentCounts).map(([dept, count]) => (
                <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <span className="font-medium text-gray-900">{dept}</span>
                  <Badge variant="outline">{count} {count === 1 ? 'project' : 'projects'}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card style={{ backgroundColor: 'var(--council-orange-light)' }} className="border-[var(--council-orange)]">
          <CardHeader>
            <CardTitle>Projects by Priority</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {(['Critical', 'High', 'Medium', 'Low'] as const).map(priority => {
                const count = priorityCounts[priority] || 0;
                if (count === 0) return null;
                return (
                  <div key={priority} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${getPriorityColor(priority)}`} />
                      <span className="font-medium text-gray-900">{priority}</span>
                    </div>
                    <Badge variant="outline">{count} {count === 1 ? 'project' : 'projects'}</Badge>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Critical Attention Items */}
      <Card style={{ backgroundColor: '#FEF2F2' }} className="border-red-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Items Requiring Attention
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {criticalRisks > 0 && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-red-900">Critical Risks Open</p>
                    <p className="text-sm text-red-700 mt-1">
                      {criticalRisks} critical {criticalRisks === 1 ? 'risk requires' : 'risks require'} immediate attention
                    </p>
                  </div>
                  <Badge className="bg-red-600 text-white">{criticalRisks}</Badge>
                </div>
              </div>
            )}
            {criticalIssues > 0 && (
              <div className="p-4 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-orange-900">Critical Issues Open</p>
                    <p className="text-sm text-orange-700 mt-1">
                      {criticalIssues} critical {criticalIssues === 1 ? 'issue needs' : 'issues need'} resolution
                    </p>
                  </div>
                  <Badge className="bg-orange-600 text-white">{criticalIssues}</Badge>
                </div>
              </div>
            )}
            {onHoldProjects > 0 && (
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-semibold text-yellow-900">Projects On Hold</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      {onHoldProjects} {onHoldProjects === 1 ? 'project is' : 'projects are'} currently on hold
                    </p>
                  </div>
                  <Badge className="bg-yellow-600 text-white">{onHoldProjects}</Badge>
                </div>
              </div>
            )}
            {criticalRisks === 0 && criticalIssues === 0 && onHoldProjects === 0 && (
              <div className="p-4 border rounded-lg" style={{ backgroundColor: 'var(--council-green-light)', borderColor: 'var(--council-green)' }}>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5" style={{ color: 'var(--council-green)' }} />
                  <p className="font-medium" style={{ color: 'var(--council-green)' }}>No critical items requiring immediate attention</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* High Priority Projects */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              High Priority Projects
            </span>
            <Link to="/projects">
              <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">
                View All
              </Badge>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {projects
              .filter(p => p.priority === 'Critical' || p.priority === 'High')
              .slice(0, 5)
              .map(project => (
                <Link 
                  key={project.id} 
                  to={`/projects/${project.id}`}
                  className="block p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-gray-900">{project.name}</h4>
                        <Badge className={getStatusColor(project.status)}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">{project.department}</p>
                    </div>
                    <div className={`w-2 h-2 rounded-full ${getPriorityColor(project.priority)}`} />
                  </div>
                </Link>
              ))}
            {projects.filter(p => p.priority === 'Critical' || p.priority === 'High').length === 0 && (
              <p className="text-gray-500 text-center py-4">No high priority projects</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
