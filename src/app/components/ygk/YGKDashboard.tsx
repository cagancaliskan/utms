import { useState, useMemo } from 'react';
import { AppShell } from '../AppShell';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  Users,
  TrendingUp,
  FileCheck,
  List,
  Award,
  ArrowLeft
} from 'lucide-react';
import type { User } from '../../App';
import { AcademicEligibility } from './AcademicEligibility';
import { RankingTable } from './RankingTable';
import { IntibakGeneration } from './IntibakGeneration';
import { useApplications } from '../../lib/applications-store';
import type { Application } from '../../types';

interface YGKDashboardProps {
  user: User;
  onLogout: () => void;
  onSwitchRole?: () => void;
}

type Section = 'dashboard' | 'evaluations' | 'rankings' | 'intibak';
type YGKView = 'dashboard' | 'eligibility' | 'ranking' | 'intibak';

function isYgkVisible(a: Application): boolean {
  return (
    a.status === 'academic_evaluation' ||
    a.status === 'dean_review' ||
    a.status === 'board_review' ||
    a.status === 'approved' ||
    a.status === 'waitlisted' ||
    a.status === 'rejected'
  );
}

export function YGKDashboard({ user, onLogout, onSwitchRole }: YGKDashboardProps) {
  const { applications } = useApplications();
  const [currentSection, setCurrentSection] = useState<Section>('dashboard');
  const [currentView, setCurrentView] = useState<YGKView>('dashboard');
  const [selectedAppId, setSelectedAppId] = useState<string | null>(null);

  // Stats are computed live from the store so the panel reflects every YDYO and YGK action.
  const stats = useMemo(() => {
    const ygk = applications.filter(isYgkVisible);
    const eligible = ygk.filter(a => a.gpa >= 2.5);
    const ranked = ygk.filter(a => typeof a.rank === 'number');
    const intibakReady = ygk.filter(a => a.status === 'dean_review' || a.status === 'board_review' || a.status === 'approved');
    const sem3 = ygk.filter(a => a.targetSemester === 3);
    const sem5 = ygk.filter(a => a.targetSemester === 5);
    return {
      total: ygk.length,
      eligible: eligible.length,
      ranked: ranked.length,
      intibakReady: intibakReady.length,
      sem3: { total: sem3.length, eligible: sem3.filter(a => a.gpa >= 2.5).length },
      sem5: { total: sem5.length, eligible: sem5.filter(a => a.gpa >= 2.5).length }
    };
  }, [applications]);

  const renderDashboardContent = () => {
    if (currentView === 'eligibility' || currentSection === 'evaluations') {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => { setCurrentView('dashboard'); setCurrentSection('dashboard'); }} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <AcademicEligibility onBack={() => { setCurrentView('dashboard'); setCurrentSection('dashboard'); }} />
        </div>
      );
    }

    if (currentView === 'ranking' || currentSection === 'rankings') {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => { setCurrentView('dashboard'); setCurrentSection('dashboard'); }} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <RankingTable onBack={() => { setCurrentView('dashboard'); setCurrentSection('dashboard'); }} />
        </div>
      );
    }

    if (currentView === 'intibak' || currentSection === 'intibak') {
      return (
        <div className="space-y-4">
          <Button variant="ghost" onClick={() => { setCurrentView('dashboard'); setCurrentSection('dashboard'); setSelectedAppId(null); }} className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Geri Dön
          </Button>
          <IntibakGeneration
            applicationId={selectedAppId}
            actorName={`${user.name} ${user.surname}`}
            onBack={() => { setCurrentView('dashboard'); setCurrentSection('dashboard'); setSelectedAppId(null); }}
          />
        </div>
      );
    }

    const ygkApps = applications.filter(isYgkVisible);

    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-gray-900 mb-2">YGK Komisyon Paneli</h1>
          <p className="text-gray-600">Bölüm İntibak ve Transfer Komisyonu - Akademik Değerlendirme ve Sıralama</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Toplam Başvuran</div>
                <div className="text-2xl text-gray-900">{stats.total}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Uygun Bulunan</div>
                <div className="text-2xl text-gray-900">{stats.eligible}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <FileCheck className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">Sıralanan</div>
                <div className="text-2xl text-gray-900">{stats.ranked}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-600 mb-1">İntibakı Hazır</div>
                <div className="text-2xl text-gray-900">{stats.intibakReady}</div>
              </div>
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">Akademik Değerlendirme Kuyruğu</h2>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Başvuru ID</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Öğrenci</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Hedef Program</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Dönem</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">GPA</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">ÖSYM</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">Dil Durumu</th>
                  <th className="text-left py-3 px-4 text-sm text-gray-700">İntibak</th>
                </tr>
              </thead>
              <tbody>
                {ygkApps.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-gray-500">
                      Akademik değerlendirme bekleyen başvuru yok.
                    </td>
                  </tr>
                ) : (
                  ygkApps.map(a => (
                    <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm text-gray-900">{a.id}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{a.studentName}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{a.targetProgram}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{a.targetSemester}. Dönem</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{a.gpa.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">{a.osymScore.toFixed(2)}</td>
                      <td className="py-3 px-4 text-sm">
                        {a.languageStatus === 'successful' && <Badge className="bg-green-100 text-green-800">Başarılı</Badge>}
                        {a.languageStatus === 'exempt' && <Badge className="bg-blue-100 text-blue-800">Muaf (+5)</Badge>}
                        {a.languageStatus === 'unsuccessful' && <Badge className="bg-red-100 text-red-800">Başarısız</Badge>}
                        {!a.languageStatus && <Badge variant="outline">Beklemede</Badge>}
                      </td>
                      <td className="py-3 px-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setSelectedAppId(a.id); setCurrentView('intibak'); }}
                        >
                          <Award className="w-4 h-4 mr-1" />
                          İntibak
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">Dönem Bazlı Kontenjanlar</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-900">3. Dönem Giriş</div>
                  <div className="text-sm text-gray-600">2. Sınıf Transferi</div>
                </div>
                <Badge>Kontenjan: 8</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Toplam Başvuran:</span><span className="text-gray-900">{stats.sem3.total}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Uygun:</span><span className="text-gray-900">{stats.sem3.eligible}</span></div>
              </div>
            </div>

            <div className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-gray-900">5. Dönem Giriş</div>
                  <div className="text-sm text-gray-600">3. Sınıf Transferi</div>
                </div>
                <Badge>Kontenjan: 4</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm"><span className="text-gray-600">Toplam Başvuran:</span><span className="text-gray-900">{stats.sem5.total}</span></div>
                <div className="flex justify-between text-sm"><span className="text-gray-600">Uygun:</span><span className="text-gray-900">{stats.sem5.eligible}</span></div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center space-y-2"
            onClick={() => setCurrentView('eligibility')}
          >
            <FileCheck className="w-8 h-8" style={{ color: '#7A1616' }} />
            <div>
              <div className="text-sm">Akademik Uygunluk İncelemesi</div>
              <div className="text-xs text-gray-500 mt-1">GPA, dönem ve gereksinim kontrolü</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center space-y-2"
            onClick={() => setCurrentView('ranking')}
          >
            <List className="w-8 h-8" style={{ color: '#7A1616' }} />
            <div>
              <div className="text-sm">Sıralama ve Listeler</div>
              <div className="text-xs text-gray-500 mt-1">Asil/Yedek listelerini oluştur</div>
            </div>
          </Button>

          <Button
            variant="outline"
            className="h-auto py-6 flex flex-col items-center space-y-2"
            onClick={() => { setSelectedAppId(null); setCurrentView('intibak'); }}
          >
            <Award className="w-8 h-8" style={{ color: '#7A1616' }} />
            <div>
              <div className="text-sm">Ders Muafiyeti (İntibak)</div>
              <div className="text-xs text-gray-500 mt-1">Ders eşleştirme ve muafiyet</div>
            </div>
          </Button>
        </div>

        <Card className="p-6">
          <h2 className="text-gray-900 mb-4">Transfer Puanı Hesaplama Formülü</h2>
          <div className="p-4 bg-gray-50 rounded-lg">
            <div className="text-sm text-gray-900 mb-2">
              <strong>Transfer Puanı = (GPA × 0.60) + (ÖSYM Puanı ÷ 6 × 0.40)</strong>
            </div>
            <div className="text-xs text-gray-600 space-y-1">
              <div>• GPA Bileşeni: %60 ağırlık (100'lük sisteme normalize edilir)</div>
              <div>• ÖSYM Bileşeni: %40 ağırlık (100'lük sisteme normalize edilir)</div>
              <div>• Dil yeterlilik muafiyeti: +5 bonus puan</div>
            </div>
          </div>
        </Card>
      </div>
    );
  };

  return (
    <AppShell
      user={user}
      currentRole="YGK"
      onLogout={onLogout}
      onSwitchRole={onSwitchRole}
      currentSection={currentSection}
      onNavigate={(section) => {
        setCurrentSection(section as Section);
        if (section === 'dashboard') setCurrentView('dashboard');
        else if (section === 'evaluations') setCurrentView('eligibility');
        else if (section === 'rankings') setCurrentView('ranking');
        else if (section === 'intibak') setCurrentView('intibak');
      }}
    >
      {renderDashboardContent()}
    </AppShell>
  );
}
