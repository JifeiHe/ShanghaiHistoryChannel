import React, { useState } from 'react';
import { Traveler, LanguageMode } from '../types';
import { NATIONALITIES, PACKAGES } from '../data';
import { BilingualText } from './BilingualText';
import { X, Lock, ShieldCheck, UserCheck, AlertCircle } from 'lucide-react';

interface AddTravelerFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (traveler: Omit<Traveler, 'id'>) => void;
  languageMode: LanguageMode;
}

export const AddTravelerForm: React.FC<AddTravelerFormProps> = ({
  isOpen,
  onClose,
  onSave,
  languageMode,
}) => {
  const [name, setName] = useState('');
  const [nationality, setNationality] = useState('US');
  const [email, setEmail] = useState('');
  const [passport, setPassport] = useState('');
  const [packageId, setPackageId] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [emergencyContact, setEmergencyContact] = useState('');
  const [consent, setConsent] = useState(false);
  
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) {
      newErrors.name = languageMode === 'zh-first' ? '姓名不能为空' : 'Name is required';
    }
    if (!email.trim()) {
      newErrors.email = languageMode === 'zh-first' ? '邮箱不能为空' : 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = languageMode === 'zh-first' ? '请输入有效的邮箱地址' : 'Invalid email pattern';
    }
    if (!passport.trim()) {
      newErrors.passport = languageMode === 'zh-first' ? '护照号为必填项' : 'Passport number is required';
    }
    if (!consent) {
      newErrors.consent = languageMode === 'zh-first' ? '必须确认客人在册授权' : 'Consent must be checked';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    onSave({
      name,
      nationality,
      email,
      passport,
      packageId,
      emergencyContact: emergencyContact || undefined,
      consent,
    });

    // Reset Form
    setName('');
    setNationality('US');
    setEmail('');
    setPassport('');
    setPackageId('A');
    setEmergencyContact('');
    setConsent(false);
    setErrors({});
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex justify-end">
      {/* Backdrop clicks close */}
      <div className="absolute inset-0 cursor-pointer" onClick={onClose}></div>

      {/* Slide-over panel */}
      <div 
        id="add-traveler-panel"
        className="w-full max-w-lg bg-white h-full relative z-10 shadow-2xl flex flex-col border-l border-slate-200"
      >
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div>
            <h3 className="text-base font-bold text-slate-800">
              {languageMode === 'zh-first' ? '添加拼团旅客' : 'Add Group Traveler'}
            </h3>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {languageMode === 'zh-first' ? '录入海外分社或分销零售报名的旅客信息' : 'Input traveler booking specs for direct compliance review.'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form elements */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Traveler basic info */}
          <div className="space-y-4">
            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <BilingualText
                  zh="旅客姓名 / Full Name"
                  en="Traveler Name"
                  mode={languageMode}
                  primaryClass="font-semibold text-slate-700"
                  secondaryClass="text-[10px] text-slate-400 font-normal block"
                />
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. David Miller"
                className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.name ? 'border-rose-500' : 'border-slate-300'
                }`}
              />
              {errors.name && <p className="text-[11px] text-rose-600 mt-1">{errors.name}</p>}
            </div>

            {/* Nationality dropdown */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <BilingualText
                  zh="国籍 / Nationality"
                  en="Nationality"
                  mode={languageMode}
                  primaryClass="font-semibold text-slate-700"
                  secondaryClass="text-[10px] text-slate-400 font-normal block"
                />
              </label>
              <select
                value={nationality}
                onChange={(e) => setNationality(e.target.value)}
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              >
                {NATIONALITIES.map((nat) => (
                  <option key={nat.code} value={nat.code}>
                    {languageMode === 'zh-first' ? nat.zh : nat.en}
                  </option>
                ))}
              </select>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <BilingualText
                  zh="电子邮箱 / Email Address"
                  en="Email Address"
                  mode={languageMode}
                  primaryClass="font-semibold text-slate-700"
                  secondaryClass="text-[10px] text-slate-400 font-normal block"
                />
              </label>
              <input
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="e.g. d.miller@agency.com"
                className={`w-full px-3.5 py-2 text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all ${
                  errors.email ? 'border-rose-500' : 'border-slate-300'
                }`}
              />
              <span className="text-[10px] text-slate-400 leading-tight block mt-1">
                {languageMode === 'zh-first' 
                  ? '⚠️ 用于行程确认与安全身份识别，平台不会主动电话骚扰。' 
                  : '⚠️ For confirmation & electronic tour identifier. Safe encrypted custody.'}
              </span>
              {errors.email && <p className="text-[11px] text-rose-600 mt-1">{errors.email}</p>}
            </div>

            {/* Package selection with detailed helper cards */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <BilingualText
                  zh="选择产品套餐 / Select Tour Package"
                  en="Select Tour Package"
                  mode={languageMode}
                  primaryClass="font-semibold text-slate-700"
                  secondaryClass="text-[10px] text-slate-400 font-normal block"
                />
              </label>
              <div className="grid grid-cols-1 gap-2">
                {PACKAGES.map((pkg) => {
                  const isGoldMatched = packageId === pkg.id;
                  return (
                    <div
                      key={pkg.id}
                      onClick={() => setPackageId(pkg.id)}
                      className={`p-3 rounded-lg border text-left cursor-pointer transition-all flex justify-between items-start gap-4 ${
                        isGoldMatched
                          ? 'border-indigo-600 bg-indigo-50/20'
                          : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`w-4 h-4 rounded-full border flex items-center justify-center text-[10px] font-bold ${
                            isGoldMatched ? 'bg-indigo-600 text-white border-indigo-600' : 'border-slate-300'
                          }`}>
                            {pkg.id}
                          </span>
                          <BilingualText
                            zh={pkg.nameZh}
                            en={pkg.nameEn}
                            mode={languageMode}
                            primaryClass="font-bold text-xs text-slate-800"
                            secondaryClass="text-[10px] text-slate-500 font-medium"
                          />
                        </div>
                        <p className="text-[11px] text-slate-400 leading-tight">
                          {languageMode === 'zh-first' ? pkg.descZh : pkg.descEn}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded shrink-0">
                        ¥{pkg.price}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Optional Emergency Contact */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                <BilingualText
                  zh="紧急联系渠道 (选填) / Emergency Contact"
                  en="Emergency Contact (Optional)"
                  mode={languageMode}
                  primaryClass="font-semibold text-slate-700"
                  secondaryClass="text-[10px] text-slate-400 font-normal block"
                />
              </label>
              <input
                type="text"
                value={emergencyContact}
                onChange={(e) => setEmergencyContact(e.target.value)}
                placeholder="e.g. Helen Neeson +44 20 7946"
                className="w-full px-3.5 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </div>

            {/* Passport compliance highlight box */}
            <div className="p-3.5 bg-amber-50/50 rounded-lg border border-amber-200 space-y-2">
              <div className="flex items-center gap-1.5 text-amber-800 font-semibold text-xs">
                <Lock className="w-4 h-4 text-amber-600" />
                <BilingualText
                  zh="护照敏感内容录入"
                  en="Passport Confidential Input"
                  mode={languageMode}
                  primaryClass="font-semibold text-amber-800"
                  secondaryClass="text-[10px] text-amber-600/80 font-normal leading-tight ml-1"
                />
              </div>

              <input
                type="text"
                value={passport}
                onChange={(e) => setPassport(e.target.value)}
                placeholder="e.g. US7738290"
                className={`w-full px-3.5 py-2 text-sm border bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all ${
                  errors.passport ? 'border-rose-500' : 'border-amber-300'
                }`}
              />
              <p className="text-[10px] text-amber-700/80 leading-normal">
                {languageMode === 'zh-first'
                  ? '🔒 注：根据涉外网络治安管理条例与文旅安全备案标准，护照号属于高级保护隐私，将在写入时传输至国资云端安全套接层并实施RSA非对称多重散列解耦加密保护（敏感信息，加密存储）。'
                  : '🔒 Note: Passport numbers undergo military-grade asymmetric RSA hashing. We conform strictly to cross-border tourism security clearance regulations.'}
              </p>
              {errors.passport && <p className="text-[11px] text-rose-600 font-medium mt-1">{errors.passport}</p>}
            </div>

            {/* Required Consent Checkbox */}
            <div className={`p-3.5 rounded-lg border transition-all ${
              errors.consent 
                ? 'bg-rose-50 border-rose-300' 
                : consent 
                  ? 'bg-emerald-50/30 border-emerald-300' 
                  : 'bg-amber-50/30 border-amber-200'
            }`}>
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={consent}
                  onChange={(e) => setConsent(e.target.checked)}
                  className="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-slate-300 rounded cursor-pointer"
                />
                <div className="space-y-0.5">
                  <span className="text-xs font-bold text-slate-800">
                    {languageMode === 'zh-first' ? '客人已授权同意书' : 'Traveler Consent Authorization'}
                  </span>
                  <p className="text-[11px] text-slate-500 leading-tight">
                    {languageMode === 'zh-first'
                      ? '客人已确认同意并直接授权外滩运营组、境外代理报备端处理并匹配其姓名、电邮和护照用于入境上海游客名册审查。'
                      : 'Traveler represents and warrants they have explicitly consented to share their PII with the designated municipal clearance portal.'}
                  </p>
                </div>
              </label>
              {errors.consent && (
                <div className="flex items-center gap-1 mt-1.5 text-rose-600 font-medium text-[11px]">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errors.consent}</span>
                </div>
              )}
            </div>
          </div>
        </form>

        {/* Action controls footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 hover:border-slate-400 bg-white hover:bg-slate-50 rounded-lg text-xs font-semibold text-slate-600 transition-all cursor-pointer"
          >
            {languageMode === 'zh-first' ? '取消' : 'Cancel'}
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="px-5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all shadow-md shadow-indigo-600/10 cursor-pointer flex items-center gap-1"
          >
            <ShieldCheck className="w-4 h-4" />
            <BilingualText
              zh="保存旅客信息"
              en="Save & Upload Guest"
              mode={languageMode}
              primaryClass="font-bold text-white"
              secondaryClass="text-[9px] font-normal leading-tight ml-1 text-indigo-200"
            />
          </button>
        </div>
      </div>
    </div>
  );
};
