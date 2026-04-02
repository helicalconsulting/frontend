import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/Card';
import { Skeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/Toast';
import * as mockApi from '@/services/mockAdminApi';
import {
  Settings,
  Lock,
  Bell,
  Mail,
  Globe,
  Save,
  Loader2,
  AlertTriangle,
  RefreshCw,
  Wifi,
  WifiOff,
  CheckCircle2,
} from 'lucide-react';

// Types
interface SystemSettings {
  sessionTimeout: number;
  maxLoginAttempts: number;
  passwordExpireDays: number;
  defaultCurrency: string;
  defaultLanguage: string;
  enableEmailNotifications: boolean;
  enableTwoFactor: boolean;
  maintenanceMode: boolean;
  maxFileUploadSize: number;
  allowedFileTypes: string[];
  companyName: string;
  companyLogo: string;
  fiscalYearStart: string;
  approvalReminderHours: number;
  auditLogRetentionDays: number;
}

export function SettingsPage() {
  const queryClient = useQueryClient();
  const { showToast } = useToast();

  const { data: settings, isLoading, error } = useQuery({
    queryKey: ['admin-settings'],
    queryFn: mockApi.getSettings,
    staleTime: 60000,
  });

  const updateMutation = useMutation({
    mutationFn: (data: Record<string, unknown>) => mockApi.updateSettings(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-settings'] });
      showToast(
        'success',
        'Settings Saved',
        'Your settings have been updated successfully'
      );
    },
    onError: () => {
      showToast('error', 'Error', 'Failed to save settings');
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="System Settings"
          subtitle="Configure application settings and preferences"
        />
        <div className="p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {Array(4)
              .fill(null)
              .map((_, i) => (
                <Card key={i}>
                  <CardHeader>
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-4 w-48 mt-2" />
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header
          title="System Settings"
          subtitle="Configure application settings and preferences"
        />
        <div className="p-6">
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-center gap-3">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <p className="text-sm text-red-700">
              Failed to load settings. Please try again later.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="System Settings"
        subtitle="Configure application settings and preferences"
      />

      <div className="p-6">
        {/* SYSPRO Connection Status Banner */}
        <div className="mb-6 rounded-xl border border-emerald-200 bg-gradient-to-r from-emerald-50 to-teal-50 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-emerald-500 flex items-center justify-center">
              <Wifi className="h-5 w-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-semibold text-emerald-900">
                  SYSPRO Integration
                </p>
                <Badge variant="success" className="text-xs">
                  Mock Mode
                </Badge>
              </div>
              <p className="text-xs text-emerald-700">
                Running with demo data • Switch to LIVE in .env configuration
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              Connected
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Security Settings */}
          <SecuritySettings
            settings={settings! as SystemSettings}
            onSave={(data: any) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />

          {/* Regional Settings */}
          <RegionalSettings
            settings={settings! as SystemSettings}
            onSave={(data: any) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />

          {/* Notification Settings */}
          <NotificationSettings
            settings={settings! as SystemSettings}
            onSave={(data: any) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />

          {/* File Settings */}
          <FileSettings
            settings={settings! as SystemSettings}
            onSave={(data: any) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />

          {/* Company Settings */}
          <CompanySettings
            settings={settings! as SystemSettings}
            onSave={(data: any) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />

          {/* Workflow Settings */}
          <WorkflowSettings
            settings={settings! as SystemSettings}
            onSave={(data: any) => updateMutation.mutate(data)}
            isLoading={updateMutation.isPending}
          />
        </div>
      </div>
    </div>
  );
}

// Security Settings Card
interface SettingsCardProps {
  settings: SystemSettings;
  onSave: (data: Partial<SystemSettings>) => void;
  isLoading: boolean;
}

function SecuritySettings({ settings, onSave, isLoading }: SettingsCardProps) {
  const [formData, setFormData] = useState({
    sessionTimeout: settings.sessionTimeout,
    maxLoginAttempts: settings.maxLoginAttempts,
    passwordExpireDays: settings.passwordExpireDays,
    enableTwoFactor: settings.enableTwoFactor,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
            <Lock className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Security Settings</CardTitle>
            <CardDescription>
              Authentication and session configuration
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Session Timeout (minutes)
            </label>
            <Input
              type="number"
              value={formData.sessionTimeout}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  sessionTimeout: parseInt(e.target.value, 10),
                })
              }
              min="1"
              max="1440"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max Login Attempts
            </label>
            <Input
              type="number"
              value={formData.maxLoginAttempts}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxLoginAttempts: parseInt(e.target.value, 10),
                })
              }
              min="1"
              max="10"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password Expiry (days)
            </label>
            <Input
              type="number"
              value={formData.passwordExpireDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  passwordExpireDays: parseInt(e.target.value, 10),
                })
              }
              min="0"
              max="365"
            />
            <p className="text-xs text-gray-400 mt-1">
              Set to 0 to disable password expiry
            </p>
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Two-Factor Authentication
              </p>
              <p className="text-xs text-gray-500">
                Require 2FA for all users
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  enableTwoFactor: !formData.enableTwoFactor,
                })
              }
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{
                backgroundColor: formData.enableTwoFactor
                  ? '#10b981'
                  : '#d1d5db',
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.enableTwoFactor ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Security Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Regional Settings Card
function RegionalSettings({ settings, onSave, isLoading }: SettingsCardProps) {
  const [formData, setFormData] = useState({
    defaultCurrency: settings.defaultCurrency,
    defaultLanguage: settings.defaultLanguage,
    fiscalYearStart: settings.fiscalYearStart,
  });

  const currencies = ['USD', 'EUR', 'GBP', 'ZAR', 'NGN', 'KES', 'EGP', 'AED'];
  const languages = ['en', 'fr', 'es', 'de', 'pt', 'ar'];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Globe className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Regional Settings</CardTitle>
            <CardDescription>
              Currency, language, and locale preferences
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Currency
            </label>
            <select
              value={formData.defaultCurrency}
              onChange={(e) =>
                setFormData({ ...formData, defaultCurrency: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {currencies.map((curr) => (
                <option key={curr} value={curr}>
                  {curr}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Default Language
            </label>
            <select
              value={formData.defaultLanguage}
              onChange={(e) =>
                setFormData({ ...formData, defaultLanguage: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {languages.map((lang) => (
                <option key={lang} value={lang}>
                  {lang.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fiscal Year Start
            </label>
            <select
              value={formData.fiscalYearStart}
              onChange={(e) =>
                setFormData({ ...formData, fiscalYearStart: e.target.value })
              }
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
            >
              {[
                'January',
                'February',
                'March',
                'April',
                'May',
                'June',
                'July',
                'August',
                'September',
                'October',
                'November',
                'December',
              ].map((month, idx) => (
                <option key={month} value={String(idx + 1).padStart(2, '0')}>
                  {month}
                </option>
              ))}
            </select>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Regional Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Notification Settings Card
function NotificationSettings({
  settings,
  onSave,
  isLoading,
}: SettingsCardProps) {
  const [formData, setFormData] = useState({
    enableEmailNotifications: settings.enableEmailNotifications,
    approvalReminderHours: settings.approvalReminderHours,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Notification Settings</CardTitle>
            <CardDescription>Email and alert preferences</CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-700">
                Email Notifications
              </p>
              <p className="text-xs text-gray-500">
                Send email alerts for approvals
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  enableEmailNotifications: !formData.enableEmailNotifications,
                })
              }
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{
                backgroundColor: formData.enableEmailNotifications
                  ? '#10b981'
                  : '#d1d5db',
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.enableEmailNotifications
                    ? 'translate-x-6'
                    : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Approval Reminder (hours)
            </label>
            <Input
              type="number"
              value={formData.approvalReminderHours}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  approvalReminderHours: parseInt(e.target.value, 10),
                })
              }
              min="1"
              max="168"
            />
            <p className="text-xs text-gray-400 mt-1">
              Send reminder after pending this many hours
            </p>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Notification Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// File Settings Card
function FileSettings({ settings, onSave, isLoading }: SettingsCardProps) {
  const [formData, setFormData] = useState({
    maxFileUploadSize: settings.maxFileUploadSize,
    allowedFileTypes: settings.allowedFileTypes.join(', '),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      maxFileUploadSize: formData.maxFileUploadSize,
      allowedFileTypes: formData.allowedFileTypes
        .split(',')
        .map((t) => t.trim()),
    } as any);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>File Upload Settings</CardTitle>
            <CardDescription>
              Configure file upload limits and types
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Max File Size (MB)
            </label>
            <Input
              type="number"
              value={formData.maxFileUploadSize}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  maxFileUploadSize: parseInt(e.target.value, 10),
                })
              }
              min="1"
              max="100"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Allowed File Types
            </label>
            <Input
              value={formData.allowedFileTypes}
              onChange={(e) =>
                setFormData({ ...formData, allowedFileTypes: e.target.value })
              }
              placeholder="pdf, doc, docx, xls, xlsx"
            />
            <p className="text-xs text-gray-400 mt-1">
              Comma-separated file extensions
            </p>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save File Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Company Settings Card
function CompanySettings({ settings, onSave, isLoading }: SettingsCardProps) {
  const [formData, setFormData] = useState({
    companyName: settings.companyName,
    maintenanceMode: settings.maintenanceMode,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center">
            <Settings className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Company Settings</CardTitle>
            <CardDescription>
              Organization information and branding
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company Name
            </label>
            <Input
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
              placeholder="Your Company Name"
            />
          </div>

          <div className="flex items-center justify-between py-2">
            <div>
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-700">
                  Maintenance Mode
                </p>
                {formData.maintenanceMode && (
                  <Badge variant="warning">Active</Badge>
                )}
              </div>
              <p className="text-xs text-gray-500">
                Disable access for non-admin users
              </p>
            </div>
            <button
              type="button"
              onClick={() =>
                setFormData({
                  ...formData,
                  maintenanceMode: !formData.maintenanceMode,
                })
              }
              className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
              style={{
                backgroundColor: formData.maintenanceMode
                  ? '#f59e0b'
                  : '#d1d5db',
              }}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  formData.maintenanceMode ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Company Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}

// Workflow Settings Card
function WorkflowSettings({ settings, onSave, isLoading }: SettingsCardProps) {
  const [formData, setFormData] = useState({
    auditLogRetentionDays: settings.auditLogRetentionDays,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-rose-500 to-red-600 flex items-center justify-center">
            <RefreshCw className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle>Workflow & Audit</CardTitle>
            <CardDescription>
              Workflow and audit trail settings
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Audit Log Retention (days)
            </label>
            <Input
              type="number"
              value={formData.auditLogRetentionDays}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  auditLogRetentionDays: parseInt(e.target.value, 10),
                })
              }
              min="30"
              max="3650"
            />
            <p className="text-xs text-gray-400 mt-1">
              How long to keep audit logs (min 30 days)
            </p>
          </div>

          <div className="pt-4">
            <Button type="submit" disabled={isLoading} className="w-full">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Save className="h-4 w-4" />
              )}
              Save Workflow Settings
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
