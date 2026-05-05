import { useState, useMemo } from 'react';
import { AppShell } from '../AppShell';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import {
  Languages,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Search,
  ArrowLeft
} from 'lucide-react';
import type { User } from '../../App';
import { LanguageReviewDetail } from './LanguageReviewDetail';
import { useApplications } from '../../lib/applications-store';
import type { Application } from '../../types';

interface YDYODashboardProps {
  user: User;
  onLogout: () => void;
  onSwitchRole?: () => void;
}

type Section = 'dashboard';

function ydyoStatusOf(a: Application): 'pending' | 'successful' | 'unsuccessful' | 'exempt' {
  if (a.languageStatus === 'successful') return 'successful';
  if (a.languageStatus === 'unsuccessful') return 'unsuccessful';
  if (a.languageStatus === 'exempt') return 'exempt';
  return 'pending';
}

function formatDate(d?: Date): string {
  if (!d) return '-';
  const date = d instanceof Date ? d : new Date(d);
  return date.toLocaleDateString('tr-TR');
}

export function YDYODashboard({ user, onLogout, onSwitchRole }: YDYODashboardProps) {
  const { applications } = useApplications();
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // YDYO sees: anything currently in language_evaluation, or anything that has any languageStatus.
  const ydyoApplications: Application[] = useMemo(
    () => applications.filter(a => a.status === 'language_evaluation' || !!a.languageStatus),
    [applications]
  );

  const handleReview = (appId: string) => setSelectedAppId(appId);
  const handleBackToQueue = () => setSelectedAppId(null);

  const renderDashboardContent = () => {
    if (selectedAppId) {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={handleBackToQueue} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <LanguageReviewDetail
            applicationId={selectedAppId}
            officerName={`${user.name} ${user.surname}`}
            onBack={handleBackToQueue}
          />
        </div>
      );
    }

    const pendingCount = ydyoApplications.filter(a => ydyoStatusOf(a) === 'pending').length;
    const successfulCount = ydyoApplications.filter(a => ydyoStatusOf(a) === 'successful').length;
    const unsuccessfulCount = ydyoApplications.filter(a => ydyoStatusOf(a) === 'unsuccessful').length;
    const exemptCount = ydyoApplications.filter(a => ydyoStatusOf(a) === 'exempt').length;

    const filtered = ydyoApplications.filter(app => {
      const ydyoStatus = ydyoStatusOf(app);
      const matchesSearch = searchQuery === '' ||
        app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        app.targetProgram.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || ydyoStatus === statusFilter;
      return matchesSearch && matchesStatus;
    });

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-gray-900 mb-2">YDYO Memur Paneli</h1>
          <p className="text-gray-600">Yabancı Diller Yüksekokulu - Dil Yeterlilik Değerlendirmesi</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">İnceleme Bekleyen</div>
                <div className="text-2xl text-gray-900">{pendingCount}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Başarılı</div>
                <div className="text-2xl text-gray-900">{successfulCount}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Muaf</div>
                <div className="text-2xl text-gray-900">{exemptCount}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Başarısız</div>
                <div className="text-2xl text-gray-900">{unsuccessfulCount}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center">
                <XCircle className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Toplam</div>
                <div className="text-2xl text-gray-900">{ydyoApplications.length}</div>
              </div>
              <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{ backgroundColor: '#C00000' }}>
                <Languages className="w-6 h-6 text-white" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">Dil Yeterlilik Kriterleri</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-900 mb-2">TOEFL iBT</div>
              <div className="text-xs text-gray-600">Minimum Puan: 79</div>
              <div className="text-xs text-gray-600">Muafiyet: ≥ 90 (+5 bonus)</div>
              <div className="text-xs text-gray-500 mt-1">Geçerlilik: 2 yıl</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-900 mb-2">IELTS Academic</div>
              <div className="text-xs text-gray-600">Minimum Puan: 6.0</div>
              <div className="text-xs text-gray-600">Muafiyet: ≥ 7.0 (+5 bonus)</div>
              <div className="text-xs text-gray-500 mt-1">Geçerlilik: 2 yıl</div>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="text-sm text-gray-900 mb-2">YDS</div>
              <div className="text-xs text-gray-600">Minimum Puan: 70</div>
              <div className="text-xs text-gray-600">Muafiyet: ≥ 85 (+5 bonus)</div>
              <div className="text-xs text-gray-500 mt-1">Geçerlilik: 5 yıl</div>
            </div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-900">Değerlendirme Kuyruğu</h2>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Başvuru ara..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-64"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-md text-sm"
              >
                <option value="all">Tüm Durumlar</option>
                <option value="pending">Bekliyor</option>
                <option value="successful">Başarılı</option>
                <option value="exempt">Muaf</option>
                <option value="unsuccessful">Başarısız</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Başvuru ID</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Öğrenci</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Program</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Dönem</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Tarih</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Durum</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">İşlemler</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-8 text-center text-gray-500">
                      Kriterlere uygun başvuru bulunamadı
                    </td>
                  </tr>
                ) : (
                  filtered.map((app) => {
                    const s = ydyoStatusOf(app);
                    return (
                      <tr key={app.id} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-900">{app.id}</td>
                        <td className="py-3 px-4 text-sm text-gray-900">{app.studentName}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{app.targetProgram}</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{app.targetSemester}. Dönem</td>
                        <td className="py-3 px-4 text-sm text-gray-600">{formatDate(app.submittedAt)}</td>
                        <td className="py-3 px-4">
                          {s === 'pending' && <Badge className="bg-yellow-100 text-yellow-800">Bekliyor</Badge>}
                          {s === 'successful' && <Badge className="bg-green-100 text-green-800">Başarılı</Badge>}
                          {s === 'exempt' && <Badge className="bg-blue-100 text-blue-800">Muaf</Badge>}
                          {s === 'unsuccessful' && <Badge className="bg-red-100 text-red-800">Başarısız</Badge>}
                        </td>
                        <td className="py-3 px-4">
                          <Button size="sm" variant="outline" onClick={() => handleReview(app.id)}>
                            <Eye className="w-4 h-4 mr-1" />
                            İncele
                          </Button>
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
      currentRole="YDYO"
      onLogout={onLogout}
      onSwitchRole={onSwitchRole}
      currentSection={currentSection}
      onNavigate={(section) => {
        setCurrentSection(section as Section);
        setSelectedAppId(null);
      }}
    >
      {renderDashboardContent()}
    </AppShell>
  );
}
