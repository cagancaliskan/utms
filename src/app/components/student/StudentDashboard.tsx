import { useState, useMemo } from 'react';
import { AppShell } from '../AppShell';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  FileText,
  Eye,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plus,
  Search,
  Filter,
  ArrowLeft
} from 'lucide-react';
import type { User } from '../../App';
import { ApplicationForm } from './ApplicationForm';
import { DocumentUpload } from './DocumentUpload';
import { ApplicationTimeline } from './ApplicationTimeline';
import { FinalResult } from './FinalResult';
import { AppealForm } from './AppealForm';
import { useApplications } from '../../lib/applications-store';
import type { Application, ApplicationStatus } from '../../types';

interface StudentDashboardProps {
  user: User;
  onLogout: () => void;
  onSwitchRole?: () => void;
}

type StudentView =
  | 'dashboard'
  | 'new-application'
  | 'upload-documents'
  | 'view-timeline'
  | 'view-result'
  | 'submit-appeal';

type Section = 'dashboard';

const STAGE_LABELS: Record<ApplicationStatus, string> = {
  draft: 'Taslak',
  submitted: 'Gönderildi',
  intake_verification: 'ÖİDB Doğrulama',
  returned_for_correction: 'Düzeltme için İade',
  language_evaluation: 'YDYO Dil Değerlendirmesi',
  academic_evaluation: 'YGK Akademik Değerlendirme',
  dean_review: 'Dekanlık İncelemesi',
  board_review: 'Fakülte Kurulu',
  approved: 'Onaylandı',
  rejected: 'Reddedildi',
  waitlisted: 'Yedek Listede'
};

const PROGRESS_BY_STATUS: Record<ApplicationStatus, number> = {
  draft: 5,
  submitted: 15,
  intake_verification: 25,
  returned_for_correction: 20,
  language_evaluation: 40,
  academic_evaluation: 60,
  dean_review: 75,
  board_review: 90,
  approved: 100,
  rejected: 100,
  waitlisted: 100
};

function statusConfig(status: ApplicationStatus): { label: string; className: string } {
  switch (status) {
    case 'draft':
      return { label: 'Taslak', className: 'bg-gray-100 text-gray-800' };
    case 'submitted':
      return { label: 'Gönderildi', className: 'bg-blue-100 text-blue-800' };
    case 'returned_for_correction':
      return { label: 'Düzeltme İçin İade', className: 'bg-red-100 text-red-800' };
    case 'approved':
      return { label: 'Kabul Edildi', className: 'bg-green-100 text-green-800' };
    case 'rejected':
      return { label: 'Reddedildi', className: 'bg-red-100 text-red-800' };
    case 'waitlisted':
      return { label: 'Yedek', className: 'bg-purple-100 text-purple-800' };
    default:
      return { label: 'İncelemede', className: 'bg-yellow-100 text-yellow-800' };
  }
}

function formatDate(d?: Date): string {
  if (!d) return '-';
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('tr-TR', { year: 'numeric', month: '2-digit', day: '2-digit' });
}

export function StudentDashboard({ user, onLogout, onSwitchRole }: StudentDashboardProps) {
  const { applications } = useApplications();
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');
  const [currentView, setCurrentView] = useState<StudentView>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [pendingDraft, setPendingDraft] = useState<{ id: string; data: any } | null>(null);

  // The student only sees their own applications, filtered by the logged-in user id.
  const myApplications: Application[] = useMemo(
    () => applications.filter(a => a.studentId === user.id),
    [applications, user.id]
  );

  const handleFormSave = (data: any) => {
    // Carry the draft forward to the document upload screen. Persistence happens
    // when the student clicks the final "Submit Application" button there.
    setPendingDraft({ id: data.applicationId, data });
    setCurrentView('upload-documents');
  };

  const renderDashboardContent = () => {
    if (currentView === 'new-application') {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setCurrentView('dashboard')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <ApplicationForm
            user={user}
            onSave={handleFormSave}
            onCancel={() => setCurrentView('dashboard')}
          />
        </div>
      );
    }

    if (currentView === 'upload-documents' && pendingDraft) {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setCurrentView('new-application')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <DocumentUpload
            user={user}
            applicationId={pendingDraft.id}
            applicationData={pendingDraft.data}
            onComplete={() => {
              setPendingDraft(null);
              setCurrentView('dashboard');
            }}
            onBack={() => setCurrentView('new-application')}
          />
        </div>
      );
    }

    if (currentView === 'view-timeline' && selectedAppId) {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => { setCurrentView('dashboard'); setSelectedAppId(null); }} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <ApplicationTimeline
            applicationId={selectedAppId}
            onBack={() => {
              setCurrentView('dashboard');
              setSelectedAppId(null);
            }}
          />
        </div>
      );
    }

    if (currentView === 'view-result' && selectedAppId) {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => { setCurrentView('dashboard'); setSelectedAppId(null); }} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <FinalResult
            applicationId={selectedAppId}
            onAppeal={() => setCurrentView('submit-appeal')}
            onBack={() => {
              setCurrentView('dashboard');
              setSelectedAppId(null);
            }}
          />
        </div>
      );
    }

    if (currentView === 'submit-appeal' && selectedAppId) {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => setCurrentView('view-result')} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <AppealForm
            applicationId={selectedAppId}
            onSubmit={() => setCurrentView('dashboard')}
            onCancel={() => setCurrentView('view-result')}
          />
        </div>
      );
    }

    const inReviewCount = myApplications.filter(a =>
      ['submitted','intake_verification','language_evaluation','academic_evaluation','dean_review','board_review'].includes(a.status)
    ).length;
    const acceptedCount = myApplications.filter(a => a.status === 'approved' || a.finalDecision === 'admitted').length;
    const actionRequiredCount = myApplications.filter(a => a.status === 'returned_for_correction').length;

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-gray-900 mb-2">Hoş Geldiniz, {user.name}!</h1>
            <p className="text-gray-600">Transfer başvurularınızı buradan yönetebilirsiniz.</p>
          </div>
          <Button
            style={{ backgroundColor: '#C00000' }}
            onClick={() => setCurrentView('new-application')}
          >
            <Plus className="w-4 h-4 mr-2" />
            Yeni Başvuru Oluştur
          </Button>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Toplam Başvuru</div>
                <div className="text-2xl text-gray-900">{myApplications.length}</div>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C00000' }}>
                <FileText className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">İncelemede</div>
                <div className="text-2xl text-gray-900">{inReviewCount}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Kabul Edilen</div>
                <div className="text-2xl text-gray-900">{acceptedCount}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Eylem Bekleyen</div>
                <div className="text-2xl text-gray-900">{actionRequiredCount}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Search and Filter */}
        <Card className="p-4">
          <div className="flex items-center space-x-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Başvuru ID veya program ara..."
                className="pl-10"
              />
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filtrele
            </Button>
          </div>
        </Card>

        {/* Applications Table */}
        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">Tüm Başvurularım</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Başvuru ID</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Hedef Program</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Dönem</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Durum</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Mevcut Aşama</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Son Güncelleme</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {myApplications.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Henüz başvurunuz bulunmamaktadır. Yukarıdan yeni bir başvuru oluşturabilirsiniz.
                    </td>
                  </tr>
                ) : (
                  myApplications.map((app) => {
                    const cfg = statusConfig(app.status);
                    const stage = STAGE_LABELS[app.status] || app.status;
                    const lastEvent = app.timeline[app.timeline.length - 1];
                    const lastUpdate = lastEvent?.timestamp || app.submittedAt;
                    return (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{app.id}</td>
                        <td className="py-3 px-4">
                          <div className="text-sm text-gray-900">{app.targetProgram}</div>
                          <div className="text-xs text-gray-500">Mühendislik Fakültesi</div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{app.targetSemester}. Dönem</td>
                        <td className="py-3 px-4">
                          <Badge className={cfg.className}>{cfg.label}</Badge>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">{stage}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(lastUpdate)}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedAppId(app.id);
                                setCurrentView('view-timeline');
                              }}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              Takip Et
                            </Button>
                            {(app.status === 'approved' || app.status === 'rejected' || app.status === 'waitlisted') && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedAppId(app.id);
                                  setCurrentView('view-result');
                                }}
                              >
                                Sonucu Gör
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <AppShell
      user={user}
      currentRole="Student"
      onLogout={onLogout}
      onSwitchRole={onSwitchRole}
      currentSection={currentSection}
      onNavigate={(section) => {
        setCurrentSection(section as Section);
        setCurrentView('dashboard');
        setSelectedAppId(null);
      }}
    >
      {renderDashboardContent()}
    </AppShell>
  );
}
