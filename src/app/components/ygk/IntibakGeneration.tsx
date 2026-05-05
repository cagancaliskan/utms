import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Alert, AlertDescription } from '../ui/alert';
import { ArrowLeft, Save, AlertCircle, Info } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { useApplications } from '../../lib/applications-store';
import type { IntibakEntry } from '../../types';

interface IntibakGenerationProps {
  applicationId: string | null;
  actorName: string;
  onBack: () => void;
}

const PREVIOUS_COURSES = [
  { code: 'CS101', name: 'Programlamaya Giriş', credits: 4, grade: 'A', suggestedMatch: 'COMP 101' },
  { code: 'CS201', name: 'Veri Yapıları', credits: 4, grade: 'B+', suggestedMatch: 'COMP 201' },
  { code: 'MATH101', name: 'Matematik I', credits: 4, grade: 'A-', suggestedMatch: 'MATH 101' },
  { code: 'PHYS101', name: 'Fizik I', credits: 3, grade: 'B', suggestedMatch: 'PHYS 101' },
];

const TARGET_COURSES = [
  { code: 'COMP 101', name: 'Programming Fundamentals', credits: 4 },
  { code: 'COMP 201', name: 'Data Structures & Algorithms', credits: 4 },
  { code: 'MATH 101', name: 'Calculus I', credits: 4 },
  { code: 'COMP 150', name: 'Digital Systems', credits: 4 },
  { code: 'PHYS 101', name: 'Physics I', credits: 3 },
];

export function IntibakGeneration({ applicationId, actorName, onBack }: IntibakGenerationProps) {
  const { getById, saveIntibak, applications } = useApplications();

  // If no specific application was selected, fall back to the first YGK-eligible one for the demo.
  const fallback = applications.find(a =>
    a.status === 'academic_evaluation' || a.status === 'dean_review' || a.status === 'board_review'
  );
  const application = (applicationId && getById(applicationId)) || fallback;

  const [mappings, setMappings] = useState<Record<string, string>>({});
  const [isManual, setIsManual] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const initialMappings: Record<string, string> = {};
    PREVIOUS_COURSES.forEach(c => {
      if (c.suggestedMatch) initialMappings[c.code] = c.suggestedMatch;
    });
    setMappings(initialMappings);
  }, []);

  const handleMappingChange = (prevCode: string, targetCode: string) => {
    setMappings(prev => ({ ...prev, [prevCode]: targetCode }));
    const originalSuggested = PREVIOUS_COURSES.find(c => c.code === prevCode)?.suggestedMatch;
    if (targetCode !== originalSuggested) {
      setIsManual(prev => ({ ...prev, [prevCode]: true }));
      toast.info(`${prevCode} için manuel eşleştirme uygulandı`);
    } else {
      setIsManual(prev => ({ ...prev, [prevCode]: false }));
    }
  };

  const [isFinalizing, setIsFinalizing] = useState(false);

  // SRS-derived rule: every previous course must have a resolved mapping (a target or "no-equivalent")
  // before the table can be persisted. The Save button is disabled until that is true.
  const allResolved = PREVIOUS_COURSES.every(c => !!mappings[c.code]);

  const handleFinalize = () => {
    if (!application) {
      toast.error('Geçerli bir başvuru seçilmedi.');
      return;
    }
    if (!allResolved) {
      toast.error('Tüm dersler için bir eşleştirme veya "Eşdeğeri Yok" seçilmelidir.');
      return;
    }

    setIsFinalizing(true);
    setTimeout(() => {
      const entries: IntibakEntry[] = PREVIOUS_COURSES.map(prev => {
        const targetCode = mappings[prev.code];
        const target = TARGET_COURSES.find(t => t.code === targetCode);
        return {
          previousCourse: `${prev.code} - ${prev.name}`,
          previousCredit: prev.credits,
          equivalentCourse: target ? `${target.code} - ${target.name}` : 'Eşdeğeri Yok',
          equivalentCredit: target ? target.credits : 0,
          status: target ? 'approved' : 'rejected'
        };
      });

      saveIntibak(application.id, entries, actorName);
      toast.success('İntibak tablosu başarıyla kesinleştirildi ve kaydedildi.', {
        description: `${application.id} başvurusu Dekanlık incelemesine yönlendirildi.`
      });
      setIsFinalizing(false);
      onBack();
    }, 900);
  };

  if (!application) {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          İntibak oluşturmak için akademik değerlendirme aşamasında bir başvuru bulunmuyor.
          Lütfen önce YDYO dil değerlendirmesini tamamlayan bir başvuru olduğundan emin olun.
        </AlertDescription>
      </Alert>
    );
  }

  const transferredCredits = PREVIOUS_COURSES.reduce((acc, c) => {
    const t = TARGET_COURSES.find(x => x.code === mappings[c.code]);
    return acc + (t ? t.credits : 0);
  }, 0);
  const remainingCredits = 140 - transferredCredits;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-gray-900 mb-2 font-bold">Ders Muafiyeti (İntibak) Oluşturma</h1>
          <p className="text-gray-600">
            {application.id} - {application.studentName} • {application.targetSemester}. Dönem Giriş
          </p>
        </div>
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Panele Geri Dön
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start space-x-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5" />
          <div className="text-xs text-blue-800">
            <strong>Akıllı Eşleştirici Aktif:</strong> Sistem, ders kodlarına ve içeriklerine göre otomatik eşleşme önerdi. Kaydetmeden önce lütfen inceleyiniz.
          </div>
        </div>
        <div className="bg-yellow-50 border border-yellow-100 p-3 rounded-lg flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
          <div className="text-xs text-blue-800">
            <strong>Kredi Uyum Uyarısı:</strong> Transfer edilen kredilerin hedef ders kredisine eşit veya daha fazla olduğundan emin olun.
          </div>
        </div>
      </div>

      <Card className="p-0 overflow-hidden">
        <div className="grid grid-cols-2 bg-gray-100 border-b text-[10px] font-bold uppercase tracking-widest text-gray-500">
          <div className="p-3 border-r">Önceki Kurum (Eski Dersler)</div>
          <div className="p-3">Hedef Müfredat (Yeni Karşılıklar)</div>
        </div>

        <div className="divide-y">
          {PREVIOUS_COURSES.map((prev, index) => (
            <div key={index} className="grid grid-cols-2 group">
              <div className="p-4 border-r bg-white group-hover:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-bold text-gray-900">{prev.code}</div>
                    <div className="text-xs text-gray-600 mb-2 font-medium">{prev.name}</div>
                    <div className="flex space-x-2">
                      <Badge variant="outline" className="text-[10px] h-4 font-mono">Kredi: {prev.credits}</Badge>
                      <Badge variant="outline" className="text-[10px] h-4 font-mono">Not: {prev.grade}</Badge>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-white group-hover:bg-gray-50 transition-colors">
                <div className="space-y-3">
                  <Select value={mappings[prev.code]} onValueChange={(val) => handleMappingChange(prev.code, val)}>
                    <SelectTrigger className="h-9 text-xs">
                      <SelectValue placeholder="Eşdeğer ders seçiniz..." />
                    </SelectTrigger>
                    <SelectContent>
                      {TARGET_COURSES.map((target) => (
                        <SelectItem key={target.code} value={target.code} className="text-xs">
                          {target.code} - {target.name} ({target.credits} kr)
                        </SelectItem>
                      ))}
                      <SelectItem value="no-equivalent" className="text-xs">Eşdeğeri Yok</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="flex items-center justify-between">
                    {mappings[prev.code] && mappings[prev.code] !== 'no-equivalent' ? (
                      <div className="flex items-center space-x-2">
                        {isManual[prev.code] ? (
                          <Badge className="bg-orange-100 text-orange-700 hover:bg-orange-100 border-orange-200 text-[10px] h-5">
                            Manuel Eşleşme
                          </Badge>
                        ) : (
                          <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100 border-blue-200 text-[10px] h-5">
                            Önerilen Eşleşme
                          </Badge>
                        )}
                        <span className="text-[10px] text-gray-400 italic">2024-25 Müfredatı ile Uyumlu</span>
                      </div>
                    ) : mappings[prev.code] === 'no-equivalent' ? (
                      <Badge className="bg-gray-100 text-gray-700 text-[10px] h-5">Muafiyet Yok</Badge>
                    ) : (
                      <span className="text-[10px] text-red-500 font-medium">Transfer için muafiyet gereklidir</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-gray-50 border-t flex items-center justify-between">
          <div className="space-y-1">
            <div className="text-sm font-bold text-gray-900">Özet</div>
            <div className="text-xs text-gray-600">
              Transfer Edilen: <span className="font-bold text-green-600">{transferredCredits}.00 AKTS</span>
              {' | '}
              Kalan: <span className="font-bold text-[#C00000]">{remainingCredits}.00 AKTS</span>
            </div>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="sm">Raporu Önizle</Button>
            <Button
              size="sm"
              style={{ backgroundColor: '#C00000' }}
              className="shadow-lg shadow-red-200"
              onClick={handleFinalize}
              disabled={isFinalizing || !allResolved}
            >
              {isFinalizing ? (
                <div className="flex items-center">
                  <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2"></div>
                  Kaydediliyor...
                </div>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  İntibak Tablosunu Tamamla
                </>
              )}
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
