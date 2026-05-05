import { User, UserRole } from '../types';
import { LogOut, User as UserIcon } from 'lucide-react';
import { Button } from './ui/button';

interface TopNavProps {
  user: User | null;
  currentRole?: UserRole;
  onLogout: () => void;
  onRoleSwitch?: () => void;
}

const roleNames: Record<UserRole, string> = {
  student: 'Student',
  oidb: 'Student Affairs Office (ÖİDB)',
  ydyo: 'Foreign Languages Office (YDYO)',
  ygk: 'Departmental Transfer Commission (YGK)',
  dean: "Dean's Office",
  board: 'Faculty Board',
  admin: 'System Administrator'
};

export function TopNav({ user, currentRole, onLogout, onRoleSwitch }: TopNavProps) {
  return (
    <nav className="bg-[#C00000] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white rounded-lg flex items-center justify-center">
              <div className="w-8 h-8 bg-[#C00000] rounded"></div>
            </div>
            <div>
              <h1 className="text-white">Transfer Management System</h1>
              {currentRole && (
                <p className="text-sm text-white/90">{roleNames[currentRole]}</p>
              )}
            </div>
          </div>
          
          {user && (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
                <UserIcon className="w-4 h-4" />
                <span>{user.firstName} {user.lastName}</span>
              </div>
              {user.roles.length > 1 && onRoleSwitch && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={onRoleSwitch}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  Switch Role
                </Button>
              )}
              <Button 
                variant="ghost" 
                size="sm"
                onClick={onLogout}
                className="text-white hover:bg-white/10"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
