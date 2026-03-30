import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import {
  UserPlus,
  Upload,
  ArrowLeft,
  CheckCircle2,
  FileText,
  X,
} from 'lucide-react';

export function MasterDataRequestPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    onboardingType: 'Customer',
    entityName: '',
    taxVatNumber: '',
    currency: 'KES',
    address: '',
  });
  const [fileName, setFileName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setTimeout(() => navigate('/master-data'), 2000);
    }, 1500);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header title="Master Data Request" subtitle="Submit new entity for multi-level approval" />
        <div className="flex items-center justify-center p-12">
          <div className="text-center animate-in">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100">
              <CheckCircle2 className="h-8 w-8 text-emerald-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900">Request Submitted Successfully</h3>
            <p className="text-sm text-gray-500 mt-2">
              Your request has been queued for approval. Redirecting...
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header
        title="Master Data Request"
        subtitle="Submit new entity for multi-level approval"
      />

      <div className="p-6">
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <button
            onClick={() => navigate('/master-data')}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors mb-5"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Master Data
          </button>

          {/* Form Card */}
          <div className="rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20">
                  <UserPlus className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white">Master Data Request</h3>
                  <p className="text-xs text-blue-100">Submit new entity for multi-level approval</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              {/* Row: Onboarding Type + Entity Name */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Onboarding Type
                  </label>
                  <select
                    value={formData.onboardingType}
                    onChange={(e) => setFormData({ ...formData, onboardingType: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="Customer">Customer</option>
                    <option value="Supplier">Supplier</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Entity Name
                  </label>
                  <Input
                    value={formData.entityName}
                    onChange={(e) => setFormData({ ...formData, entityName: e.target.value })}
                    placeholder="BEST DEALS LIMITED"
                    required
                  />
                </div>
              </div>

              {/* Row: Tax/VAT + Currency */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Tax / VAT Number
                  </label>
                  <Input
                    value={formData.taxVatNumber}
                    onChange={(e) => setFormData({ ...formData, taxVatNumber: e.target.value })}
                    placeholder="PS13465456X"
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                    Currency
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-sm text-gray-700 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="KES">KES</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                    <option value="GBP">GBP</option>
                  </select>
                </div>
              </div>

              {/* Full Address */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Full Address
                </label>
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Corner House, 5th floor, Kimathi Street, Nairobi."
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-sm text-gray-700 placeholder:text-gray-400 shadow-sm resize-none focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-100"
                  rows={3}
                  required
                />
              </div>

              {/* Support Documents */}
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1.5">
                  Support Documents (Compliance/ID)
                </label>
                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 rounded-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm text-gray-600 cursor-pointer hover:bg-gray-100 transition-colors">
                    <Upload className="h-4 w-4" />
                    Browse...
                    <input
                      type="file"
                      className="hidden"
                      accept=".pdf,.jpg,.png"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setFileName(file.name);
                      }}
                    />
                  </label>
                  <div className="flex-1">
                    {fileName ? (
                      <div className="flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-3 py-2">
                        <FileText className="h-4 w-4 text-blue-600" />
                        <span className="text-sm text-blue-700 truncate">{fileName}</span>
                        <button
                          type="button"
                          onClick={() => setFileName('')}
                          className="ml-auto text-blue-400 hover:text-blue-600"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-sm text-gray-400">No file selected.</span>
                    )}
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1.5">Max size 5MB (PDF, JPG, PNG)</p>
              </div>

              {/* Submit */}
              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting || !formData.entityName || !formData.taxVatNumber}
                  className="w-full h-11 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Submitting...
                    </span>
                  ) : (
                    'Submit Request'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
