import { useParams, Link } from 'react-router';
import { useState } from 'react';
import { useProjects } from '../context/ProjectContext';
import { useAudit } from '../context/AuditContext';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '../components/ui/dialog';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { toast } from 'sonner';
import { 
  ArrowLeft,
  Calendar,
  User,
  Building2,
  DollarSign,
  AlertTriangle,
  AlertCircle,
  FileText,
  Target,
  Milestone,
  Plus,
  X,
  Layers
} from 'lucide-react';

export function ProjectDetails() {
  const { id } = useParams();
  const { getProject, addMilestone } = useProjects();
  const { addAuditLog, addNotification } = useAudit();
  const project = getProject(id || '');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    status: 'Not Started' as 'Not Started' | 'In Progress' | 'Completed' | 'Overdue',
    grantAmount: '',
    deliverable: '',
  });
  const [deliverables, setDeliverables] = useState<string[]>([]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addDeliverable = () => {
    if (formData.deliverable.trim()) {
      setDeliverables(prev => [...prev, formData.deliverable.trim()]);
      setFormData(prev => ({ ...prev, deliverable: '' }));
    }
  };

  const removeDeliverable = (index: number) => {
    setDeliverables(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title || !formData.description || !formData.dueDate || !formData.grantAmount) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newMilestone = {
      id: `gm-${Date.now()}`,
      title: formData.title,
      description: formData.description,
      dueDate: formData.dueDate,
      status: formData.status,
      grantAmount: formData.grantAmount,
      deliverables: deliverables,
    };

    addMilestone(id || '', newMilestone);

    // Log the action
    addAuditLog({
      action: 'Created',
      entityType: 'Milestone',
      entityId: newMilestone.id,
      entityName: newMilestone.title,
      description: `Added grant milestone "${newMilestone.title}" to ${project?.name}`,
    });

    // Create notification for deadline
    const dueDate = new Date(newMilestone.dueDate);
    const daysUntilDue = Math.ceil((dueDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));

    if (daysUntilDue > 0 && daysUntilDue <= 30) {
      addNotification({
        userId: '2', // Project manager
        type: 'Deadline',
        title: 'New Milestone Created',
        message: `Milestone "${newMilestone.title}" is due in ${daysUntilDue} days`,
        projectId: id,
        projectName: project?.name,
        actionUrl: `/projects/${id}`,
      });
    }

    toast.success('Milestone added successfully!');

    // Reset form
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      status: 'Not Started',
      grantAmount: '',
      deliverable: '',
    });
    setDeliverables([]);
    setIsDialogOpen(false);
  };

  if (!project) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-gray-500 py-12">Project not found</p>
            <div className="flex justify-center">
              <Link to="/projects">
                <Button>Back to Projects</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active':
      case 'Completed':
      case 'Achieved':
        return 'bg-green-100 text-green-800';
      case 'Planning':
      case 'In Progress':
      case 'Not Started':
        return 'bg-blue-100 text-blue-800';
      case 'On Hold':
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'Open':
        return 'bg-orange-100 text-orange-800';
      case 'Cancelled':
      case 'Rejected':
        return 'bg-red-100 text-red-800';
      case 'Mitigated':
      case 'Resolved':
      case 'Approved':
      case 'Implemented':
        return 'bg-green-100 text-green-800';
      case 'Closed':
        return 'bg-gray-100 text-gray-800';
      case 'Overdue':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'Critical':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'High':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const phases: Array<'Initiation' | 'Planning' | 'Execution' | 'Monitoring' | 'Closure'> = [
    'Initiation',
    'Planning',
    'Execution',
    'Monitoring',
    'Closure'
  ];

  const currentPhaseIndex = phases.indexOf(project.phase);

  const getPhaseColor = (phase: string) => {
    switch (phase) {
      case 'Initiation':
        return 'text-white';
      case 'Planning':
        return 'text-white';
      case 'Execution':
        return 'text-white';
      case 'Monitoring':
        return 'text-white';
      case 'Closure':
        return 'text-white';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPhaseBackgroundColor = (phase: string) => {
    switch (phase) {
      case 'Initiation':
        return '#7A298F';
      case 'Planning':
        return '#006FB9';
      case 'Execution':
        return '#F4721E';
      case 'Monitoring':
        return '#50B66D';
      case 'Closure':
        return '#50B66D';
      default:
        return '#9CA3AF';
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-start gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="icon" className="mt-1">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3 flex-wrap">
            <h2 className="text-3xl font-bold text-gray-900">{project.name}</h2>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
            <Badge className={getSeverityColor(project.priority)}>
              {project.priority} Priority
            </Badge>
          </div>
          <p className="text-gray-600 mt-2">{project.description}</p>
        </div>
      </div>

      {/* Project Phase Indicator */}
      <Card style={{ backgroundColor: 'var(--council-blue-light)' }} className="border-[var(--council-blue)]">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Layers className="w-5 h-5" style={{ color: 'var(--council-blue)' }} />
            <span>Project Phase</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Current Phase Badge */}
            <div className="flex items-center gap-3">
              <Badge
                className={`${getPhaseColor(project.phase)} text-lg px-4 py-2`}
                style={{ backgroundColor: getPhaseBackgroundColor(project.phase) }}
              >
                {project.phase}
              </Badge>
              <span className="text-gray-600">Current Phase</span>
            </div>

            {/* Phase Progress Visualization */}
            <div className="flex items-center gap-2">
              {phases.map((phase, index) => (
                <div key={phase} className="flex-1 flex flex-col items-center gap-2">
                  <div
                    className={`w-full h-2 rounded-full transition-all ${
                      index <= currentPhaseIndex
                        ? 'bg-gradient-to-r from-[var(--council-blue)] to-[var(--council-purple)]'
                        : 'bg-gray-200'
                    }`}
                  />
                  <span
                    className={`text-xs text-center ${
                      index === currentPhaseIndex
                        ? 'font-semibold'
                        : index < currentPhaseIndex
                          ? 'text-gray-600'
                          : 'text-gray-400'
                    }`}
                    style={index === currentPhaseIndex ? { color: 'var(--council-blue)' } : {}}
                  >
                    {phase}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Overview Card */}
      <Card style={{ backgroundColor: 'var(--council-green-light)' }}>
        <CardHeader>
          <CardTitle>Project Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Timeline</p>
                <p className="font-semibold text-gray-900">{project.startDate} to {project.endDate}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <DollarSign className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Budget</p>
                <p className="font-semibold text-gray-900">{project.budget}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <User className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Project Manager</p>
                <p className="font-semibold text-gray-900">{project.projectManager}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Building2 className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Department</p>
                <p className="font-semibold text-gray-900">{project.department}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Active Risks</p>
                <p className="font-semibold" style={{ color: 'var(--council-orange)' }}>{project.risks.filter(r => r.status === 'Open').length} / {project.risks.length}</p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-600">Open Issues</p>
                <p className="font-semibold text-red-600">{project.issues.filter(i => i.status === 'Open').length} / {project.issues.length}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Tabs */}
      <Tabs defaultValue="risks" className="w-full">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
          <TabsTrigger value="risks">Risks ({project.risks.length})</TabsTrigger>
          <TabsTrigger value="issues">Issues ({project.issues.length})</TabsTrigger>
          <TabsTrigger value="scope">Scope Changes ({project.scopeChanges.length})</TabsTrigger>
          <TabsTrigger value="benefits">Benefits ({project.benefits.length})</TabsTrigger>
          <TabsTrigger value="milestones">Milestones ({project.grantMilestones.length})</TabsTrigger>
        </TabsList>

        {/* Risks Tab */}
        <TabsContent value="risks" className="space-y-4">
          <Card style={{ backgroundColor: 'var(--council-orange-light)' }} className="border-[var(--council-orange)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" style={{ color: 'var(--council-orange)' }} />
                Project Risks
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.risks.length > 0 ? (
                <div className="space-y-4">
                  {project.risks.map(risk => (
                    <div key={risk.id} className={`p-4 border rounded-lg ${getSeverityColor(risk.impact)}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{risk.title}</h4>
                            <Badge className={getStatusColor(risk.status)}>{risk.status}</Badge>
                          </div>
                          <p className="text-sm mt-2">{risk.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                              <span className="font-medium">Likelihood: </span>
                              <Badge variant="outline" className={getSeverityColor(risk.likelihood)}>
                                {risk.likelihood}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium">Impact: </span>
                              <Badge variant="outline" className={getSeverityColor(risk.impact)}>
                                {risk.impact}
                              </Badge>
                            </div>
                            <div>
                              <span className="font-medium">Owner: </span>
                              {risk.owner}
                            </div>
                            <div>
                              <span className="font-medium">Identified: </span>
                              {risk.dateIdentified}
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-white rounded border">
                            <p className="text-sm font-medium">Mitigation Strategy:</p>
                            <p className="text-sm mt-1">{risk.mitigation}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No risks identified for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Issues Tab */}
        <TabsContent value="issues" className="space-y-4">
          <Card style={{ backgroundColor: '#FEF2F2' }} className="border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-red-600" />
                Project Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.issues.length > 0 ? (
                <div className="space-y-4">
                  {project.issues.map(issue => (
                    <div key={issue.id} className={`p-4 border rounded-lg ${getSeverityColor(issue.priority)}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{issue.title}</h4>
                            <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                            <Badge variant="outline" className={getSeverityColor(issue.priority)}>
                              {issue.priority}
                            </Badge>
                          </div>
                          <p className="text-sm mt-2">{issue.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                            <div>
                              <span className="font-medium">Assigned To: </span>
                              {issue.assignedTo}
                            </div>
                            <div>
                              <span className="font-medium">Date Raised: </span>
                              {issue.dateRaised}
                            </div>
                            {issue.dateResolved && (
                              <div>
                                <span className="font-medium">Date Resolved: </span>
                                {issue.dateResolved}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No issues logged for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Scope Changes Tab */}
        <TabsContent value="scope" className="space-y-4">
          <Card style={{ backgroundColor: 'var(--council-purple-light)' }} className="border-[var(--council-purple)]">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" style={{ color: 'var(--council-purple)' }} />
                Scope Changes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.scopeChanges.length > 0 ? (
                <div className="space-y-4">
                  {project.scopeChanges.map(change => (
                    <div key={change.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{change.title}</h4>
                            <Badge className={getStatusColor(change.status)}>{change.status}</Badge>
                          </div>
                          <p className="text-sm mt-2">{change.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3 text-sm">
                            <div>
                              <span className="font-medium">Requested By: </span>
                              {change.requestedBy}
                            </div>
                            <div>
                              <span className="font-medium">Date Requested: </span>
                              {change.dateRequested}
                            </div>
                          </div>
                          <div className="mt-3 p-3 bg-gray-50 rounded">
                            <p className="text-sm font-medium mb-2">Impact Assessment:</p>
                            <div className="space-y-1 text-sm">
                              <p><span className="font-medium">Overall Impact:</span> {change.impact}</p>
                              {change.costImpact && <p><span className="font-medium">Cost Impact:</span> {change.costImpact}</p>}
                              {change.timelineImpact && <p><span className="font-medium">Timeline Impact:</span> {change.timelineImpact}</p>}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No scope changes requested for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Benefits Tab */}
        <TabsContent value="benefits" className="space-y-4">
          <Card style={{ backgroundColor: '#F0FDF4' }} className="border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" style={{ color: 'var(--council-green)' }} />
                Project Benefits
              </CardTitle>
            </CardHeader>
            <CardContent>
              {project.benefits.length > 0 ? (
                <div className="space-y-4">
                  {project.benefits.map(benefit => (
                    <div key={benefit.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{benefit.title}</h4>
                            <Badge className={getStatusColor(benefit.status)}>{benefit.status}</Badge>
                            <Badge variant="outline">{benefit.category}</Badge>
                          </div>
                          <p className="text-sm mt-2">{benefit.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                            <div className="p-3 rounded" style={{ backgroundColor: 'var(--council-blue-light)' }}>
                              <p className="text-sm font-medium" style={{ color: '#006FB9' }}>Target Value</p>
                              <p className="text-sm mt-1" style={{ color: '#006FB9' }}>{benefit.targetValue}</p>
                            </div>
                            <div className="p-3 rounded" style={{ backgroundColor: 'var(--council-green-light)' }}>
                              <p className="text-sm font-medium" style={{ color: '#50B66D' }}>Current Value</p>
                              <p className="text-sm mt-1" style={{ color: '#50B66D' }}>{benefit.currentValue}</p>
                            </div>
                          </div>
                          {benefit.measurementDate && (
                            <p className="text-sm text-gray-600 mt-2">
                              Last Measured: {benefit.measurementDate}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No benefits defined for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Grant Milestones Tab */}
        <TabsContent value="milestones" className="space-y-4">
          <Card style={{ backgroundColor: 'var(--council-blue-light)' }} className="border-[var(--council-blue)]">
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Milestone className="w-5 h-5" style={{ color: 'var(--council-blue)' }} />
                Grant Milestones
              </CardTitle>
              <Button
                onClick={() => setIsDialogOpen(true)}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: 'var(--council-blue)' }}
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Milestone
              </Button>
            </CardHeader>
            <CardContent>
              {project.grantMilestones.length > 0 ? (
                <div className="space-y-4">
                  {project.grantMilestones.map(milestone => (
                    <div key={milestone.id} className="p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold">{milestone.title}</h4>
                            <Badge className={getStatusColor(milestone.status)}>{milestone.status}</Badge>
                          </div>
                          <p className="text-sm mt-2">{milestone.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-3 text-sm">
                            <div>
                              <span className="font-medium">Due Date: </span>
                              {milestone.dueDate}
                            </div>
                            <div>
                              <span className="font-medium">Grant Amount: </span>
                              <span className="text-green-700 font-semibold">{milestone.grantAmount}</span>
                            </div>
                            {milestone.completionDate && (
                              <div>
                                <span className="font-medium">Completed: </span>
                                {milestone.completionDate}
                              </div>
                            )}
                          </div>
                          {milestone.deliverables.length > 0 && (
                            <div className="mt-3 p-3 bg-gray-50 rounded">
                              <p className="text-sm font-medium mb-2">Deliverables:</p>
                              <ul className="list-disc list-inside space-y-1 text-sm">
                                {milestone.deliverables.map((deliverable, index) => (
                                  <li key={index}>{deliverable}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-8">No grant milestones defined for this project</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Milestone Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add Grant Milestone</DialogTitle>
            <DialogDescription>
              Add a new milestone to track project deliverables and grant funding.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Phase 1 Completion"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  placeholder="Describe the milestone objectives and requirements"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                  rows={3}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date *</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    value={formData.dueDate}
                    onChange={(e) => handleInputChange('dueDate', e.target.value)}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => handleInputChange('status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Not Started">Not Started</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Completed">Completed</SelectItem>
                      <SelectItem value="Overdue">Overdue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="grantAmount">Grant Amount *</Label>
                <Input
                  id="grantAmount"
                  placeholder="e.g., $500,000"
                  value={formData.grantAmount}
                  onChange={(e) => handleInputChange('grantAmount', e.target.value)}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="deliverable">Deliverables</Label>
                <div className="flex gap-2">
                  <Input
                    id="deliverable"
                    placeholder="Add a deliverable"
                    value={formData.deliverable}
                    onChange={(e) => handleInputChange('deliverable', e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addDeliverable();
                      }
                    }}
                  />
                  <Button
                    type="button"
                    onClick={addDeliverable}
                    variant="outline"
                    size="sm"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {deliverables.length > 0 && (
                  <div className="mt-2 space-y-2">
                    {deliverables.map((deliverable, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded text-sm">
                        <span>{deliverable}</span>
                        <Button
                          type="button"
                          onClick={() => removeDeliverable(index)}
                          variant="ghost"
                          size="sm"
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button type="submit" className="text-white hover:opacity-90" style={{ backgroundColor: 'var(--council-blue)' }}>
                Add Milestone
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}