import { useState } from 'react';
import { useNavigate } from 'react-router';
import { useProjects } from '../context/ProjectContext';
import { useAudit } from '../context/AuditContext';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router';
import { toast } from 'sonner';

export function CreateProject() {
  const navigate = useNavigate();
  const { addProject } = useProjects();
  const { addAuditLog } = useAudit();
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    status: 'Planning',
    priority: 'Medium',
    phase: 'Initiation',
    startDate: '',
    endDate: '',
    budget: '',
    projectManager: '',
    department: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.startDate || !formData.endDate || 
        !formData.budget || !formData.projectManager || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newProject = {
      id: Date.now().toString(),
      ...formData,
      risks: [],
      issues: [],
      scopeChanges: [],
      benefits: [],
      grantMilestones: [],
    };

    addProject(newProject);

    // Log the action
    addAuditLog({
      action: 'Created',
      entityType: 'Project',
      entityId: newProject.id,
      entityName: newProject.name,
      description: `Created new project: ${newProject.name}`,
    });

    toast.success('Project created successfully!');
    navigate('/projects');
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center gap-4">
        <Link to="/projects">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Create New Project</h2>
          <p className="text-gray-600 mt-2">Enter the details for the new council project</p>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <Card style={{ backgroundColor: 'var(--council-purple-light)' }} className="border-[var(--council-purple)]">
          <CardHeader>
            <CardTitle>Project Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Project Name */}
            <div className="space-y-2">
              <Label htmlFor="name">Project Name *</Label>
              <Input
                id="name"
                placeholder="Enter project name"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
              />
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                placeholder="Enter project description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                rows={4}
                required
              />
            </div>

            {/* Status, Priority, and Phase */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="status">Status *</Label>
                <Select value={formData.status} onValueChange={(value) => handleChange('status', value)}>
                  <SelectTrigger id="status">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Active">Active</SelectItem>
                    <SelectItem value="On Hold">On Hold</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority">Priority *</Label>
                <Select value={formData.priority} onValueChange={(value) => handleChange('priority', value)}>
                  <SelectTrigger id="priority">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Low">Low</SelectItem>
                    <SelectItem value="Medium">Medium</SelectItem>
                    <SelectItem value="High">High</SelectItem>
                    <SelectItem value="Critical">Critical</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phase">Project Phase *</Label>
                <Select value={formData.phase} onValueChange={(value) => handleChange('phase', value)}>
                  <SelectTrigger id="phase">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Initiation">Initiation</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Execution">Execution</SelectItem>
                    <SelectItem value="Monitoring">Monitoring</SelectItem>
                    <SelectItem value="Closure">Closure</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date *</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="endDate">End Date *</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Budget */}
            <div className="space-y-2">
              <Label htmlFor="budget">Budget *</Label>
              <Input
                id="budget"
                placeholder="e.g., $1,500,000"
                value={formData.budget}
                onChange={(e) => handleChange('budget', e.target.value)}
                required
              />
            </div>

            {/* Project Manager */}
            <div className="space-y-2">
              <Label htmlFor="projectManager">Project Manager *</Label>
              <Input
                id="projectManager"
                placeholder="Enter project manager name"
                value={formData.projectManager}
                onChange={(e) => handleChange('projectManager', e.target.value)}
                required
              />
            </div>

            {/* Department */}
            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                placeholder="Enter department name"
                value={formData.department}
                onChange={(e) => handleChange('department', e.target.value)}
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center gap-4 pt-4">
              <Button type="submit" size="lg">
                Create Project
              </Button>
              <Link to="/projects">
                <Button type="button" variant="outline" size="lg">
                  Cancel
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </form>
    </div>
  );
}
