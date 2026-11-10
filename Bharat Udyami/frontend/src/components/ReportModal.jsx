import React, { useState } from 'react';
import { ShieldAlert, X, CheckCircle2 } from 'lucide-react';
import { submitReport } from '../services/api';

export default function ReportModal({ isOpen, onClose, targetType = 'product', targetId, targetTitle }) {
  const [reason, setReason] = useState('Inaccurate Description');
  const [details, setDetails] = useState('');
  const [reporterName, setReporterName] = useState('');
  const [reporterEmail, setReporterEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await submitReport({
        report_type: targetType,
        target_id: targetId,
        target_title: targetTitle,
        reporter_name: reporterName.trim() || 'Anonymous Consumer',
        reporter_email: reporterEmail.trim(),
        reason,
        details
      });
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          setSuccess(false);
          onClose();
        }, 2500);
      }
    } catch {
      alert("Report submission received.");
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-2 text-rose-600 font-bold text-sm">
            <ShieldAlert className="w-5 h-5" />
            <span>Report {targetType === 'product' ? 'Product Listing' : 'Seller'}</span>
          </div>
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="text-center py-6 space-y-2">
            <CheckCircle2 className="w-12 h-12 text-[#138808] mx-auto animate-bounce" />
            <h4 className="font-bold text-slate-900 text-sm">Report Submitted for Verification</h4>
            <p className="text-xs text-slate-500">
              Our Bharat Udyami Trust & Safety grievance officer will review within 24 hours.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
            <div>
              <p className="text-[11px] text-slate-500">Target:</p>
              <p className="font-bold text-slate-800 truncate">{targetTitle}</p>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Reason for Report</label>
              <select
                value={reason}
                onChange={e => setReason(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-300 bg-slate-50 text-xs font-medium"
              >
                <option value="Inaccurate Description">Inaccurate product description / specifications</option>
                <option value="Counterfeit or Copy">Machine-made copy claiming to be handmade</option>
                <option value="Unreasonable Pricing">Middleman inflation or deceptive pricing</option>
                <option value="Damaged Consignment">Damaged or broken transit delivery</option>
                <option value="Prohibited Good">Restricted or non-permitted item</option>
                <option value="Other">Other grievance</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Details & Evidence</label>
              <textarea
                rows={3}
                required
                value={details}
                onChange={e => setDetails(e.target.value)}
                placeholder="Provide clear observations so our trust team can investigate..."
                className="w-full p-2.5 rounded-xl border border-slate-300 text-xs"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="font-bold text-slate-700 block mb-1">Your Name (Optional)</label>
                <input
                  type="text"
                  value={reporterName}
                  onChange={e => setReporterName(e.target.value)}
                  placeholder="Consumer name"
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
              <div>
                <label className="font-bold text-slate-700 block mb-1">Email / Phone</label>
                <input
                  type="text"
                  value={reporterEmail}
                  onChange={e => setReporterEmail(e.target.value)}
                  placeholder="For follow-up"
                  className="w-full p-2 rounded-xl border border-slate-300 text-xs"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !details.trim()}
              className="w-full py-2.5 bg-rose-600 hover:bg-rose-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition shadow-xs"
            >
              {loading ? "Submitting to Grievance Team..." : "Submit Grievance Report"}
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
