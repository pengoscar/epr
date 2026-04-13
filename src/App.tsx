/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  ClipboardCheck, 
  FileText, 
  Settings, 
  Home, 
  Phone, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  Download, 
  Plus, 
  Search,
  ArrowRight,
  ShieldCheck,
  BarChart3,
  Globe,
  Package,
  FileSearch,
  Zap,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// --- Types ---

type View = 'home' | 'dashboard' | 'customers' | 'precheck' | 'reports' | 'rules' | 'contact';

interface Customer {
  id: string;
  name: string;
  type: string;
  contact: string;
  country: '德国' | '法国';
  category: string;
  packagingType: string;
  hasRegNo: boolean;
  hasAuthRep: boolean;
  filingStatus: '已完成' | '进行中' | '未开始';
}

interface CheckRecord {
  id: string;
  customerName: string;
  country: string;
  date: string;
  status: 'green' | 'yellow' | 'red';
  missingItems: string[];
}

// --- Mock Data ---

const MOCK_CUSTOMERS: Customer[] = [
  { id: '1', name: '深圳优选跨境物流', type: '货代企业', contact: '张经理', country: '德国', category: '包装', packagingType: '纸箱/塑料', hasRegNo: true, hasAuthRep: true, filingStatus: '已完成' },
  { id: '2', name: '宁波环球海外仓', type: '海外仓', contact: '李总', country: '法国', category: '包装', packagingType: '木托盘', hasRegNo: false, hasAuthRep: true, filingStatus: '进行中' },
  { id: '3', name: '广州速递贸易有限公司', type: '跨境卖家', contact: '王小姐', country: '德国', category: '包装', packagingType: '气泡袋', hasRegNo: true, hasAuthRep: false, filingStatus: '未开始' },
  { id: '4', name: '上海申通国际部', type: '物流企业', contact: '赵工', country: '法国', category: '包装', packagingType: '复合材料', hasRegNo: false, hasAuthRep: false, filingStatus: '未开始' },
];

const MOCK_RECORDS: CheckRecord[] = [
  { id: 'R001', customerName: '深圳优选跨境物流', country: '德国', date: '2024-03-15', status: 'green', missingItems: [] },
  { id: 'R002', customerName: '宁波环球海外仓', country: '法国', date: '2024-03-14', status: 'yellow', missingItems: ['法国年度申报状态不完整'] },
  { id: 'R003', customerName: '广州速递贸易有限公司', country: '德国', date: '2024-03-13', status: 'red', missingItems: ['缺少德国包装注册号', '授权代表信息缺失'] },
  { id: 'R004', customerName: '义乌小商品出口商', country: '德国', date: '2024-03-12', status: 'red', missingItems: ['缺少德国包装注册号'] },
];

// --- Components ---

const Logo = ({ className = "w-8 h-8", showText = false }: { className?: string, showText?: boolean }) => (
  <div className="flex items-center gap-3">
    <div className={`${className} bg-emerald-600 rounded-lg flex items-center justify-center text-white shadow-lg relative overflow-hidden`}>
      <ShieldCheck className="w-5 h-5 relative z-10" />
      <div className="absolute top-0 right-0 w-4 h-4 bg-emerald-400 rounded-full -mr-2 -mt-2 blur-sm opacity-50"></div>
    </div>
    {showText && (
      <div className="flex flex-col">
        <span className="font-bold text-white leading-none text-lg tracking-tight">EU EPR</span>
        <span className="text-[10px] text-emerald-400 font-medium uppercase tracking-widest">PreCheck</span>
      </div>
    )}
  </div>
);

const StatusBadge = ({ status }: { status: 'green' | 'yellow' | 'red' }) => {
  const config = {
    green: { color: 'bg-emerald-100 text-emerald-700 border-emerald-200', icon: CheckCircle2, text: '合规 (绿灯)' },
    yellow: { color: 'bg-amber-100 text-amber-700 border-amber-200', icon: AlertCircle, text: '风险 (黄灯)' },
    red: { color: 'bg-rose-100 text-rose-700 border-rose-200', icon: XCircle, text: '违规 (红灯)' },
  };
  const { color, icon: Icon, text } = config[status];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${color}`}>
      <Icon className="w-3 h-3 mr-1" />
      {text}
    </span>
  );
};

const Card = ({ children, className = "" }: { children: React.ReactNode, className?: string, key?: React.Key }) => (
  <div className={`bg-white rounded-xl border border-slate-200 shadow-sm ${className}`}>
    {children}
  </div>
);

// --- Views ---

const HomeView = ({ setView }: { setView: (v: View) => void }) => (
  <div className="flex flex-col">
    {/* Hero Section */}
    <section className="relative py-24 px-6 bg-gradient-to-br from-emerald-950 via-emerald-900 to-green-900 text-white overflow-hidden">
      <div className="absolute top-0 right-0 -mt-20 -mr-20 w-96 h-96 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-72 h-72 bg-green-400 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" /> 欧盟合规前置风控专家
            </div>
            <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
              面向国际物流货代企业的<br />
              <span className="text-emerald-400">欧盟 EPR 合规前置服务平台</span>
            </h1>
            <p className="text-xl text-emerald-100/80 mb-10 leading-relaxed">
              在发运前识别风险，在流程中完成校验，在节点上控制责任。<br />
              助力物流企业降低扣货、罚款风险，提升跨境合规增值服务能力。
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setView('precheck')}
                className="px-8 py-4 bg-emerald-500 text-white font-semibold rounded-lg hover:bg-emerald-400 transition-all flex items-center shadow-lg shadow-emerald-900/20"
              >
                立即预检 <ArrowRight className="ml-2 w-5 h-5" />
              </button>
              <button 
                onClick={() => setView('dashboard')}
                className="px-8 py-4 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 transition-colors backdrop-blur-sm"
              >
                查看演示
              </button>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="hidden lg:block relative"
          >
            <div className="relative z-10 bg-emerald-800/50 p-4 rounded-3xl border border-emerald-700/50 backdrop-blur-xl shadow-2xl">
              <img 
                src="https://picsum.photos/seed/compliance/800/600" 
                alt="Platform Preview" 
                className="rounded-2xl shadow-2xl opacity-90"
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Floating elements */}
            <div className="absolute -top-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-slate-100 text-slate-800 animate-bounce-slow">
              <div className="flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                <span className="text-sm font-bold">德国包装法已核验</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>

    {/* Pain Points */}
    <section className="py-20 px-6 bg-slate-50">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-slate-900 mb-4">为什么货代企业需要 EPR 前置预检？</h2>
          <div className="w-20 h-1 bg-emerald-600 mx-auto"></div>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { title: '规则复杂多变', desc: '德国、法国包装法规则差异大，人工核验效率低且极易出错。', icon: Globe },
            { title: '资料缺失隐患', desc: '发货后才发现缺少注册号或申报异常，面临海关扣货及高额罚款。', icon: FileSearch },
            { title: '责任边界模糊', desc: '随着欧盟法规收严，物流服务商的连带合规责任不断上升。', icon: ShieldCheck },
          ].map((item, i) => (
            <Card key={i} className="p-8 hover:border-emerald-300 transition-all hover:shadow-md group">
              <div className="w-12 h-12 bg-emerald-50 rounded-lg flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors">
                <item.icon className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors" />
              </div>
              <h3 className="text-xl font-bold mb-3 text-slate-800">{item.title}</h3>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>

    {/* Features */}
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-8">核心功能模块</h2>
            <div className="space-y-6">
              {[
                { title: '发运前风险识别', desc: '基于大数据规则引擎，秒级输出红黄绿合规预检结果。', icon: Zap },
                { title: '合规资料校验', desc: '自动核对注册号格式、授权代表状态及年度申报完整性。', icon: ClipboardCheck },
                { title: '注册申报协同', desc: '打通服务商接口，实现合规资料的一键补齐与快速申报。', icon: Users },
                { title: '持续合规管理', desc: '全生命周期监控客户合规状态，到期自动提醒，规避断档风险。', icon: BarChart3 },
              ].map((feature, i) => (
                <div key={i} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center">
                    <feature.icon className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800 mb-1">{feature.title}</h4>
                    <p className="text-slate-600 text-sm">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="relative">
            <div className="bg-emerald-600 rounded-2xl p-4 shadow-2xl rotate-2">
              <img 
                src="https://picsum.photos/seed/logistics-green/800/600" 
                alt="Platform Preview" 
                className="rounded-xl shadow-inner -rotate-2"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border border-slate-100 hidden md:block">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                <span className="text-sm font-bold text-slate-800">合规率提升 85%</span>
              </div>
              <div className="text-xs text-slate-500">基于 10,000+ 票真实货件数据</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    {/* Footer CTA */}
    <section className="py-24 px-6 bg-emerald-950 text-white text-center relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-from)_0%,_transparent_70%)] from-emerald-500/10 pointer-events-none"></div>
      <div className="max-w-3xl mx-auto relative z-10">
        <Logo className="w-16 h-16 mx-auto mb-8" />
        <h2 className="text-3xl font-bold mb-6">准备好提升您的物流合规竞争力了吗？</h2>
        <p className="text-emerald-200/70 mb-10 text-lg">立即加入 EU EPR PreCheck，为您的跨境业务保驾护航。</p>
        <button 
          onClick={() => setView('contact')}
          className="px-10 py-4 bg-emerald-500 text-white font-bold rounded-lg hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-900/40"
        >
          预约演示 / 联系我们
        </button>
      </div>
    </section>
  </div>
);

const DashboardView = () => (
  <div className="p-8 space-y-8">
    <div className="flex justify-between items-end">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">业务概览</h2>
        <p className="text-slate-500">欢迎回来，这是您今日的合规监控数据。</p>
      </div>
      <div className="text-sm text-slate-400">最后更新: 2024-03-16 10:30</div>
    </div>

    {/* Stats Grid */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
      {[
        { label: '总客户数', value: '128', icon: Users, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: '总预检票数', value: '3,452', icon: ClipboardCheck, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: '绿灯 (合规)', value: '2,840', icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { label: '黄灯 (风险)', value: '412', icon: AlertCircle, color: 'text-amber-600', bg: 'bg-amber-50' },
        { label: '红灯 (违规)', value: '200', icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
      ].map((stat, i) => (
        <Card key={i} className="p-6">
          <div className={`${stat.bg} w-10 h-10 rounded-lg flex items-center justify-center mb-4`}>
            <stat.icon className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className="text-2xl font-bold text-slate-800">{stat.value}</div>
          <div className="text-sm text-slate-500">{stat.label}</div>
        </Card>
      ))}
    </div>

    <div className="grid lg:grid-cols-3 gap-8">
      {/* Recent Records Table */}
      <Card className="lg:col-span-2 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">近期预检记录</h3>
          <button className="text-emerald-600 text-sm font-medium hover:underline">查看全部</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-semibold">客户名称</th>
                <th className="px-6 py-4 font-semibold">目的国</th>
                <th className="px-6 py-4 font-semibold">日期</th>
                <th className="px-6 py-4 font-semibold">状态</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {MOCK_RECORDS.map((record) => (
                <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-medium text-slate-700">{record.customerName}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.country}</td>
                  <td className="px-6 py-4 text-sm text-slate-500">{record.date}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={record.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Risk Trends (Mock Chart) */}
      <Card className="p-6">
        <h3 className="font-bold text-slate-800 mb-6">风险趋势概览</h3>
        <div className="space-y-6">
          {[
            { label: '德国包装合规率', percentage: 82, color: 'bg-emerald-600' },
            { label: '法国包装合规率', percentage: 65, color: 'bg-emerald-500' },
            { label: '资料完整度', percentage: 78, color: 'bg-emerald-400' },
          ].map((item, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-slate-600">{item.label}</span>
                <span className="font-bold text-slate-800">{item.percentage}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }}></div>
              </div>
            </div>
          ))}
          <div className="pt-4 border-t border-slate-100">
            <div className="text-xs text-slate-400 leading-relaxed">
              * 数据基于过去 30 天内所有预检票件的加权平均值。
            </div>
          </div>
        </div>
      </Card>
    </div>
  </div>
);

const CustomerListView = () => (
  <div className="p-8 space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800">客户管理</h2>
      <button className="bg-emerald-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-emerald-700 shadow-sm">
        <Plus className="w-4 h-4" /> 新增客户
      </button>
    </div>

    <Card className="overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="搜索客户名称、联系人..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
          />
        </div>
        <select className="border border-slate-200 rounded-lg px-4 py-2 text-sm text-slate-600 focus:outline-none">
          <option>所有目的国</option>
          <option>德国</option>
          <option>法国</option>
        </select>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">客户名称</th>
              <th className="px-6 py-4 font-semibold">类型</th>
              <th className="px-6 py-4 font-semibold">目的国</th>
              <th className="px-6 py-4 font-semibold">注册号</th>
              <th className="px-6 py-4 font-semibold">申报状态</th>
              <th className="px-6 py-4 font-semibold">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_CUSTOMERS.map((customer) => (
              <tr key={customer.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-slate-800">{customer.name}</div>
                  <div className="text-xs text-slate-400">{customer.contact}</div>
                </td>
                <td className="px-6 py-4 text-sm text-slate-500">{customer.type}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{customer.country}</td>
                <td className="px-6 py-4">
                  {customer.hasRegNo ? (
                    <span className="text-emerald-600 flex items-center gap-1 text-sm"><CheckCircle2 className="w-4 h-4" /> 已录入</span>
                  ) : (
                    <span className="text-rose-500 flex items-center gap-1 text-sm"><XCircle className="w-4 h-4" /> 缺失</span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    customer.filingStatus === '已完成' ? 'bg-emerald-100 text-emerald-700' :
                    customer.filingStatus === '进行中' ? 'bg-amber-100 text-amber-700' : 'bg-slate-100 text-slate-600'
                  }`}>
                    {customer.filingStatus}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-emerald-600 hover:underline mr-3">编辑</button>
                  <button className="text-slate-400 hover:text-rose-500">删除</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const PreCheckView = ({ onCheck }: { onCheck: (data: any) => void }) => {
  const [formData, setFormData] = useState({
    country: '德国',
    category: '包装',
    packagingType: '纸箱',
    packagingMaterial: '瓦楞纸',
    hasRegNo: 'no',
    hasAuthRep: 'no',
    hasAnnualFiling: 'no',
    remarks: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onCheck(formData);
  };

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">发运前合规预检</h2>
        <p className="text-slate-500">请录入本票货物的合规基础信息，系统将自动运行规则引擎进行风险识别。</p>
      </div>

      <Card className="p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">目的国</label>
              <select 
                value={formData.country}
                onChange={(e) => setFormData({...formData, country: e.target.value})}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option>德国</option>
                <option>法国</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">产品类别</label>
              <select 
                value={formData.category}
                onChange={(e) => setFormData({...formData, category: e.target.value})}
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
              >
                <option>包装 (Packaging)</option>
                <option disabled>WEEE (待开放)</option>
                <option disabled>电池 (待开放)</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">包装类型</label>
              <input 
                type="text" 
                value={formData.packagingType}
                onChange={(e) => setFormData({...formData, packagingType: e.target.value})}
                placeholder="如：纸箱、塑料袋、木托盘"
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-700">包装材料</label>
              <input 
                type="text" 
                value={formData.packagingMaterial}
                onChange={(e) => setFormData({...formData, packagingMaterial: e.target.value})}
                placeholder="如：瓦楞纸、LDPE、PP"
                className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="font-semibold text-slate-800">是否有 EPR 注册号？</div>
                <div className="text-xs text-slate-500">如德国 LUCID 注册号或法国 UIN</div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="reg" value="yes" checked={formData.hasRegNo === 'yes'} onChange={(e) => setFormData({...formData, hasRegNo: e.target.value})} className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">是</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="reg" value="no" checked={formData.hasRegNo === 'no'} onChange={(e) => setFormData({...formData, hasRegNo: e.target.value})} className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">否</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="font-semibold text-slate-800">是否有授权代表 (AR)？</div>
                <div className="text-xs text-slate-500">非欧盟境内企业必须指定授权代表</div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="ar" value="yes" checked={formData.hasAuthRep === 'yes'} onChange={(e) => setFormData({...formData, hasAuthRep: e.target.value})} className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">是</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="ar" value="no" checked={formData.hasAuthRep === 'no'} onChange={(e) => setFormData({...formData, hasAuthRep: e.target.value})} className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">否</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
              <div>
                <div className="font-semibold text-slate-800">是否完成年度申报？</div>
                <div className="text-xs text-slate-500">检查当前年度的预估量申报是否已提交</div>
              </div>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="filing" value="yes" checked={formData.hasAnnualFiling === 'yes'} onChange={(e) => setFormData({...formData, hasAnnualFiling: e.target.value})} className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">是</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="filing" value="no" checked={formData.hasAnnualFiling === 'no'} onChange={(e) => setFormData({...formData, hasAnnualFiling: e.target.value})} className="w-4 h-4 text-emerald-600" />
                  <span className="text-sm">否</span>
                </label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700">备注信息</label>
            <textarea 
              rows={3}
              value={formData.remarks}
              onChange={(e) => setFormData({...formData, remarks: e.target.value})}
              placeholder="其他需要说明的合规细节..."
              className="w-full p-2.5 border border-slate-200 rounded-lg focus:ring-2 focus:ring-emerald-500/20 outline-none"
            ></textarea>
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Zap className="w-5 h-5 fill-current" /> 运行 EPR 预检
          </button>
        </form>
      </Card>
    </div>
  );
};

const ResultView = ({ result, onBack }: { result: any, onBack: () => void }) => {
  const status = useMemo(() => {
    if (result.country === '德国' && result.hasRegNo === 'no') return 'red';
    if (result.country === '法国' && result.hasAnnualFiling === 'no') return 'yellow';
    if (!result.packagingMaterial) return 'yellow';
    if (result.hasRegNo === 'yes' && result.hasAnnualFiling === 'yes') return 'green';
    return 'yellow';
  }, [result]);

  const missingItems = useMemo(() => {
    const items = [];
    if (result.hasRegNo === 'no') items.push(`${result.country}包装注册号缺失`);
    if (result.hasAuthRep === 'no') items.push('授权代表 (AR) 信息未录入');
    if (result.hasAnnualFiling === 'no') items.push(`${result.country}年度申报状态不完整`);
    if (!result.packagingMaterial) items.push('包装材料信息缺失');
    return items;
  }, [result]);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <button onClick={onBack} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
          <ArrowRight className="w-5 h-5 rotate-180 text-slate-500" />
        </button>
        <h2 className="text-2xl font-bold text-slate-800">预检结果分析</h2>
      </div>

      <Card className="p-8 text-center space-y-6">
        <div className="flex justify-center">
          <div className={`w-24 h-24 rounded-full flex items-center justify-center ${
            status === 'green' ? 'bg-emerald-100 text-emerald-600' :
            status === 'yellow' ? 'bg-amber-100 text-amber-600' : 'bg-rose-100 text-rose-600'
          }`}>
            {status === 'green' ? <CheckCircle2 className="w-12 h-12" /> :
             status === 'yellow' ? <AlertCircle className="w-12 h-12" /> : <XCircle className="w-12 h-12" />}
          </div>
        </div>
        <div>
          <h3 className={`text-3xl font-bold ${
            status === 'green' ? 'text-emerald-700' :
            status === 'yellow' ? 'text-amber-700' : 'text-rose-700'
          }`}>
            {status === 'green' ? '合规通过' : status === 'yellow' ? '存在合规风险' : '严重违规'}
          </h3>
          <p className="text-slate-500 mt-2">
            目的国: <span className="font-bold text-slate-700">{result.country}</span> | 
            类别: <span className="font-bold text-slate-700">{result.category}</span>
          </p>
        </div>
      </Card>

      <div className="grid md:grid-cols-2 gap-8">
        <Card className="p-6">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-500" /> 缺失项与风险说明
          </h4>
          {missingItems.length > 0 ? (
            <ul className="space-y-3">
              {missingItems.map((item, i) => (
                <li key={i} className="flex gap-2 text-sm text-slate-600">
                  <span className="text-rose-500 font-bold">•</span>
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-emerald-600">暂无明显缺失项，所有必填合规字段已录入。</p>
          )}
        </Card>

        <Card className="p-6">
          <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <Zap className="w-5 h-5 text-emerald-500" /> 建议动作
          </h4>
          <div className="space-y-4">
            {status === 'red' && (
              <div className="p-3 bg-rose-50 border-l-4 border-rose-500 text-sm text-rose-700">
                <strong>立即停止发货：</strong> 缺少注册号属于严重违规，货物将被海关扣押并面临最高 10 万欧元的罚款。请立即联系合规专员补办。
              </div>
            )}
            {status === 'yellow' && (
              <div className="p-3 bg-amber-50 border-l-4 border-amber-500 text-sm text-amber-700">
                <strong>限期整改：</strong> 请在 3 个工作日内补齐年度申报或材料信息，否则将影响后续清关。
              </div>
            )}
            {status === 'green' && (
              <div className="p-3 bg-emerald-50 border-l-4 border-emerald-500 text-sm text-emerald-700">
                <strong>正常发运：</strong> 合规资料完整，建议在随货单据中附带 EPR 注册号以备查验。
              </div>
            )}
            <button className="w-full py-2 bg-slate-800 text-white rounded-lg text-sm font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
              <Download className="w-4 h-4" /> 下载合规报告 (PDF)
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

const ReportListView = () => (
  <div className="p-8 space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800">合规报告中心</h2>
      <div className="flex gap-2">
        <button className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-medium hover:bg-slate-50">
          批量导出
        </button>
      </div>
    </div>

    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-6 py-4 font-semibold">报告编号</th>
              <th className="px-6 py-4 font-semibold">关联客户</th>
              <th className="px-6 py-4 font-semibold">目的国</th>
              <th className="px-6 py-4 font-semibold">生成时间</th>
              <th className="px-6 py-4 font-semibold">预检结论</th>
              <th className="px-6 py-4 font-semibold">操作</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {MOCK_RECORDS.map((record) => (
              <tr key={record.id} className="hover:bg-slate-50 transition-colors">
                <td className="px-6 py-4 text-sm font-mono text-slate-500">#{record.id}</td>
                <td className="px-6 py-4 text-sm font-medium text-slate-800">{record.customerName}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{record.country}</td>
                <td className="px-6 py-4 text-sm text-slate-500">{record.date}</td>
                <td className="px-6 py-4">
                  <StatusBadge status={record.status} />
                </td>
                <td className="px-6 py-4 text-sm">
                  <button className="text-emerald-600 hover:underline flex items-center gap-1">
                    <Download className="w-4 h-4" /> 下载
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  </div>
);

const RuleManagerView = () => (
  <div className="p-8 space-y-6">
    <div className="flex justify-between items-center">
      <h2 className="text-2xl font-bold text-slate-800">规则引擎管理</h2>
      <button className="bg-emerald-950 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-900">
        发布新规则
      </button>
    </div>

    <div className="grid md:grid-cols-2 gap-8">
      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" /> 德国 (DE) 包装法规则
          </h3>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">运行中</span>
        </div>
        <div className="space-y-3">
          {[
            { rule: 'IF 缺少 LUCID 注册号', result: 'THEN 判定为红灯 (严重违规)' },
            { rule: 'IF 缺少授权代表 (非欧盟企业)', result: 'THEN 判定为红灯 (严重违规)' },
            { rule: 'IF 缺少年度预估量申报', result: 'THEN 判定为黄灯 (风险)' },
          ].map((r, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded border border-slate-100 text-xs">
              <div className="text-slate-500 mb-1">{r.rule}</div>
              <div className="font-bold text-slate-700">{r.result}</div>
            </div>
          ))}
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-slate-800 flex items-center gap-2">
            <Globe className="w-5 h-5 text-emerald-600" /> 法国 (FR) 包装法规则
          </h3>
          <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-xs rounded-full font-medium">运行中</span>
        </div>
        <div className="space-y-3">
          {[
            { rule: 'IF 缺少 UIN 注册号', result: 'THEN 判定为红灯 (严重违规)' },
            { rule: 'IF 缺少 Triman 标志声明', result: 'THEN 判定为黄灯 (风险)' },
            { rule: 'IF 缺少年度申报状态', result: 'THEN 判定为黄灯 (风险)' },
          ].map((r, i) => (
            <div key={i} className="p-3 bg-slate-50 rounded border border-slate-100 text-xs">
              <div className="text-slate-500 mb-1">{r.rule}</div>
              <div className="font-bold text-slate-700">{r.result}</div>
            </div>
          ))}
        </div>
      </Card>
    </div>

    <Card className="p-6 bg-emerald-50 border-emerald-100">
      <h4 className="font-bold text-emerald-900 mb-2">规则引擎说明</h4>
      <p className="text-sm text-emerald-700 leading-relaxed">
        当前 MVP 版本仅支持基于字段存在性的简单逻辑判定。后续版本将引入 AI 语义识别，支持对上传的合规证书进行真实性与有效期的自动核验。
      </p>
    </Card>
  </div>
);

const ContactView = () => (
  <div className="p-8 max-w-2xl mx-auto text-center space-y-8">
    <div className="space-y-4">
      <h2 className="text-3xl font-bold text-slate-800">联系我们 / 预约演示</h2>
      <p className="text-slate-500">我们的合规专家将在 24 小时内与您联系，为您提供定制化的物流合规解决方案。</p>
    </div>
    
    <Card className="p-8 text-left space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">您的姓名</label>
          <input type="text" className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="张先生" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">公司名称</label>
          <input type="text" className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="XX 国际货运代理" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">联系电话</label>
          <input type="tel" className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="138-xxxx-xxxx" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">电子邮箱</label>
          <input type="email" className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="service@example.com" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-semibold text-slate-700">咨询内容</label>
        <textarea rows={4} className="w-full p-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="请简要描述您的业务需求..."></textarea>
      </div>
      <button className="w-full py-4 bg-emerald-600 text-white font-bold rounded-lg hover:bg-emerald-700 transition-all shadow-md">
        提交预约申请
      </button>
    </Card>

    <div className="flex justify-center gap-8 text-slate-400">
      <div className="flex items-center gap-2 text-emerald-600 font-medium">
        <Phone className="w-4 h-4" /> 400-xxx-xxxx
      </div>
      <div className="flex items-center gap-2">
        <Globe className="w-4 h-4" /> www.eueprcheck.com
      </div>
    </div>
  </div>
);export default function App() {
  const [view, setView] = useState<View>('home');
  const [checkResult, setCheckResult] = useState<any>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleRunCheck = (data: any) => {
    setCheckResult(data);
    setView('precheck');
  };

  const navItems = [
    { id: 'home', label: '首页', icon: Home },
    { id: 'dashboard', label: '仪表盘', icon: LayoutDashboard },
    { id: 'customers', label: '客户管理', icon: Users },
    { id: 'precheck', label: '发运前预检', icon: ClipboardCheck },
    { id: 'reports', label: '预检报告', icon: FileText },
    { id: 'rules', label: '规则管理', icon: Settings },
    { id: 'contact', label: '联系我们', icon: Phone },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex text-slate-900 font-sans">
      {/* Sidebar */}
      {view !== 'home' && (
        <aside className={`bg-emerald-950 text-emerald-100 transition-all duration-300 flex flex-col ${isSidebarOpen ? 'w-64' : 'w-20'}`}>
          <div className="p-6 flex items-center gap-3 border-b border-emerald-900">
            <Logo showText={isSidebarOpen} />
          </div>
          
          <nav className="flex-1 py-6 px-3 space-y-1">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setView(item.id as View);
                  if (item.id !== 'precheck') setCheckResult(null);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  view === item.id ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-900/40' : 'hover:bg-emerald-900 hover:text-white'
                }`}
              >
                <item.icon className="w-5 h-5 flex-shrink-0" />
                {isSidebarOpen && <span className="text-sm font-medium">{item.label}</span>}
              </button>
            ))}
          </nav>

          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-4 border-t border-emerald-900 hover:bg-emerald-900 transition-colors flex justify-center"
          >
            {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </aside>
      )}

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-y-auto">
        {/* Header (only for dashboard views) */}
        {view !== 'home' && (
          <header className="bg-white border-b border-slate-200 h-16 flex items-center justify-between px-8 sticky top-0 z-20">
            <div className="font-medium text-slate-500">
              {navItems.find(n => n.id === view)?.label}
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right hidden sm:block">
                <div className="text-sm font-bold text-slate-800">管理员</div>
                <div className="text-xs text-slate-400">pengoscar68@gmail.com</div>
              </div>
              <div className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center border border-emerald-100">
                <Users className="w-5 h-5 text-emerald-600" />
              </div>
            </div>
          </header>
        )}

        <div className="flex-1">
          <AnimatePresence mode="wait">
            <motion.div
              key={view + (checkResult ? '-result' : '')}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {view === 'home' && <HomeView setView={setView} />}
              {view === 'dashboard' && <DashboardView />}
              {view === 'customers' && <CustomerListView />}
              {view === 'precheck' && (
                checkResult ? (
                  <ResultView result={checkResult} onBack={() => setCheckResult(null)} />
                ) : (
                  <PreCheckView onCheck={handleRunCheck} />
                )
              )}
              {view === 'reports' && <ReportListView />}
              {view === 'rules' && <RuleManagerView />}
              {view === 'contact' && <ContactView />}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
}
