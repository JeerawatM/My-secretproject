import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, DollarSign, TrendingUp, TrendingDown, Calendar } from 'lucide-react';

const Finance = () => {
    const [transactions, setTransactions] = useState([]);
    const [filteredTransactions, setFilteredTransactions] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [searchMonth, setSearchMonth] = useState('');
    const [currentView, setCurrentView] = useState('list');
    const [selectedMonth, setSelectedMonth] = useState('');
    const [loading, setLoading] = useState(false); 
    const [error, setError] = useState(null); 


    const [formData, setFormData] = useState({
        type: 'expense',
        title: '',
        amount: '',
        spend_date: new Date().toISOString().split('T')[0]
    });

    const handleFormChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchTransactions = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:3001/api/transactions');
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            setTransactions(data);
            setFilteredTransactions(data); 
        } catch (err) {
            setError(err.message);

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTransactions();
    }, []); 

    const handleSubmit = async (e) => {
        e.preventDefault();


        const transactionData = {
            ...formData,
            amount: parseFloat(formData.amount)
        };

        try {
            let url;
            let method;

            if (editingTransaction) {
                url = `http://localhost:3001/api/transactions/${editingTransaction.id}`;
                method = 'PUT';
            } else {
                url = 'http://localhost:3001/api/transactions';
                method = 'POST';
            }

            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(transactionData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `Failed to ${editingTransaction ? 'update' : 'add'} transaction.`);
            }

            const result = await response.json();
            alert(`รายการถูก${editingTransaction ? 'อัปเดต' : 'เพิ่ม'}สำเร็จแล้ว!`);
            console.log(result);


            fetchTransactions();
            resetForm(); 
        } catch (err) {
            alert(err.message || 'เกิดข้อผิดพลาดที่ไม่คาดคิดขึ้น');
            console.error('Submission error:', err);
        }
    };

    const handleEditClick = (transaction) => {
        setFormData({
            type: transaction.type,
            title: transaction.title,
            amount: transaction.amount.toString(),
            spend_date: transaction.spend_date.split('T')[0]
        });
        setEditingTransaction(transaction);
        setShowModal(true);
    };

    const handleDelete = async (id) => {
        if (window.confirm('คุณต้องการลบรายการนี้หรือไม่?')) {
            try {
                const response = await fetch(`http://localhost:3001/api/transactions/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
                }

                alert('รายการถูกลบสำเร็จ!');
                fetchTransactions();
            } catch (err) {
                alert(`Error deleting transaction: ${err.message}`);
                console.error('Delete error:', err);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            type: 'expense',
            title: '',
            amount: '',
            spend_date: new Date().toISOString().split('T')[0]
        });
        setEditingTransaction(null);
        setShowModal(false);
    };

    useEffect(() => {
        if (!searchMonth) {
            setFilteredTransactions(transactions);
        } else {
            const filtered = transactions.filter(t => t.spend_date.startsWith(searchMonth));
            setFilteredTransactions(filtered);
        }
    }, [searchMonth, transactions]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('th-TH', {
            style: 'currency',
            currency: 'THB'
        }).format(amount);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        try {
            const dateOnly = dateString.split('T')[0];
            return new Date(dateOnly).toLocaleDateString('th-TH', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        } catch (e) {
            console.error("Invalid date string for formatDate:", dateString, e);
            return dateString;
        }
    };

    const getMonthlyReport = (month) => {
        const monthTransactions = month
            ? transactions.filter(t => t.spend_date.startsWith(month))
            : transactions;

        const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const expense = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + parseFloat(t.amount || 0), 0);
        const balance = income - expense;

        return { income, expense, balance, transactions: monthTransactions };
    };

    const getAvailableMonths = () => {
        const months = [...new Set(transactions.map(t => t.spend_date.substring(0, 7)))];
        return months.sort().reverse();
    };

    const monthlyReport = getMonthlyReport(selectedMonth);

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center text-lg text-blue-600">กำลังโหลดข้อมูล...</div>;
    }

    if (error) {
        return <div className="min-h-screen flex items-center justify-center text-lg text-red-600">ข้อผิดพลาดในการโหลดข้อมูล: {error}</div>;
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center space-x-3">
                            <DollarSign className="w-8 h-8 text-blue-600" />
                            <h1 className="text-3xl font-bold text-gray-800">ระบบบันทึกรายรับรายจ่าย</h1>
                        </div>
                        <button
                            onClick={() => { setEditingTransaction(null); setShowModal(true); }} // Reset editing state when opening for new
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors"
                        >
                            <Plus className="w-5 h-5" />
                            <span>เพิ่มรายการ</span>
                        </button>
                    </div>

                    <div className="flex space-x-4 mb-6">
                        <button
                            onClick={() => setCurrentView('list')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentView === 'list' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            รายการทั้งหมด
                        </button>
                        <button
                            onClick={() => setCurrentView('report')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${currentView === 'report' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                }`}
                        >
                            รายงาน
                        </button>
                    </div>

                    {currentView === 'list' && (
                        <>
                            <div className="mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Search className="w-5 h-5 text-gray-500" />
                                        <label className="text-gray-700 font-medium">ค้นหาตามเดือน:</label>
                                    </div>
                                    <select
                                        value={searchMonth}
                                        onChange={(e) => setSearchMonth(e.target.value)} // Change to setSearchMonth, useEffect will handle filtering
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">ทั้งหมด</option>
                                        {getAvailableMonths().map(month => (
                                            <option key={month} value={month}>
                                                {new Date(month + '-01').toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="w-full bg-white rounded-lg overflow-hidden">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ประเภท</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายการ</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จำนวนเงิน</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">บันทึก/อัปเดต</th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">จัดการ</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {filteredTransactions.length === 0 ? (
                                            <tr>
                                                <td colSpan="6" className="px-6 py-4 text-center text-gray-500">
                                                    ไม่พบรายการ.
                                                </td>
                                            </tr>
                                        ) : (
                                            filteredTransactions.map((transaction) => (
                                                <tr key={transaction.id} className="hover:bg-gray-50">
                                                    <td className="px-6 py-4 whitespace-nowrap">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${transaction.type === 'income'
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-red-100 text-red-800'
                                                            }`}>
                                                            {transaction.type === 'income' ? (
                                                                <>
                                                                    <TrendingUp className="w-3 h-3 mr-1" />
                                                                    รายรับ
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <TrendingDown className="w-3 h-3 mr-1" />
                                                                    รายจ่าย
                                                                </>
                                                            )}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                        {transaction.title}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                                                            {formatCurrency(transaction.amount)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                        {formatDate(transaction.spend_date)}
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-xs text-gray-400">
                                                        <div>บันทึก: {formatDate(transaction.created_at)}</div>
                                                        <div>อัปเดต: {formatDate(transaction.updated_at)}</div>
                                                    </td>
                                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                                        <div className="flex space-x-2">
                                                            <button
                                                                onClick={() => handleEditClick(transaction)}
                                                                className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                                                            >
                                                                <Edit2 className="w-4 h-4" />
                                                            </button>
                                                            <button
                                                                onClick={() => handleDelete(transaction.id)}
                                                                className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    )}

                    {currentView === 'report' && (
                        <div>
                            <div className="mb-6">
                                <div className="flex items-center space-x-4">
                                    <div className="flex items-center space-x-2">
                                        <Calendar className="w-5 h-5 text-gray-500" />
                                        <label className="text-gray-700 font-medium">เลือกเดือน:</label>
                                    </div>
                                    <select
                                        value={selectedMonth}
                                        onChange={(e) => setSelectedMonth(e.target.value)}
                                        className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    >
                                        <option value="">ทั้งหมด</option>
                                        {getAvailableMonths().map(month => (
                                            <option key={month} value={month}>
                                                {new Date(month + '-01').toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                                <div className="bg-gradient-to-r from-green-400 to-green-600 p-6 rounded-lg text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-green-100">รายรับทั้งหมด</p>
                                            <p className="text-2xl font-bold">{formatCurrency(monthlyReport.income)}</p>
                                        </div>
                                        <TrendingUp className="w-8 h-8 text-green-200" />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-red-400 to-red-600 p-6 rounded-lg text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-red-100">รายจ่ายทั้งหมด</p>
                                            <p className="text-2xl font-bold">{formatCurrency(monthlyReport.expense)}</p>
                                        </div>
                                        <TrendingDown className="w-8 h-8 text-red-200" />
                                    </div>
                                </div>

                                <div className={`bg-gradient-to-r ${monthlyReport.balance >= 0 ? 'from-blue-400 to-blue-600' : 'from-orange-400 to-orange-600'} p-6 rounded-lg text-white`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-blue-100">ยอดคงเหลือ</p>
                                            <p className="text-2xl font-bold">{formatCurrency(monthlyReport.balance)}</p>
                                        </div>
                                        <DollarSign className="w-8 h-8 text-blue-200" />
                                    </div>
                                </div>

                                <div className="bg-gradient-to-r from-purple-400 to-purple-600 p-6 rounded-lg text-white">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-purple-100">จำนวนรายการ</p>
                                            <p className="text-2xl font-bold">{monthlyReport.transactions.length}</p>
                                        </div>
                                        <Calendar className="w-8 h-8 text-purple-200" />
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow">
                                <div className="px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-medium text-gray-900">
                                        รายงานรายละเอียด
                                        {selectedMonth && ` - ${new Date(selectedMonth + '-01').toLocaleDateString('th-TH', { year: 'numeric', month: 'long' })}`}
                                    </h3>
                                </div>
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">วันที่</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายการ</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายรับ</th>
                                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">รายจ่าย</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {monthlyReport.transactions.length === 0 ? (
                                                <tr>
                                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                                        ไม่พบรายการสำหรับเดือนนี้.
                                                    </td>
                                                </tr>
                                            ) : (
                                                monthlyReport.transactions.map((transaction) => (
                                                    <tr key={transaction.id} className="hover:bg-gray-50">
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                            {formatDate(transaction.spend_date)}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                                            {transaction.title}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                                                            {transaction.type === 'income' ? formatCurrency(transaction.amount) : '-'}
                                                        </td>
                                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                                                            {transaction.type === 'expense' ? formatCurrency(transaction.amount) : '-'}
                                                        </td>
                                                    </tr>
                                                ))
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {showModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                        <div className="bg-white rounded-lg p-6 w-full max-w-md">
                            <h2 className="text-xl font-bold mb-4">
                                {editingTransaction ? 'แก้ไขรายการ' : 'เพิ่มรายการใหม่'}
                            </h2>

                            <form onSubmit={handleSubmit}>
                                <div className="mb-4">
                                    <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">ประเภท</label>
                                    <select
                                        id="type"
                                        name="type"
                                        value={formData.type}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    >
                                        <option value="income">รายรับ</option>
                                        <option value="expense">รายจ่าย</option>
                                    </select>
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">ชื่อรายการ</label>
                                    <input
                                        id="title"
                                        name="title"
                                        type="text"
                                        value={formData.title}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="mb-4">
                                    <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-2">จำนวนเงิน (บาท)</label>
                                    <input
                                        id="amount"
                                        name="amount"
                                        type="number"
                                        step="0.01"
                                        value={formData.amount}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="mb-6">
                                    <label htmlFor="spend_date" className="block text-sm font-medium text-gray-700 mb-2">วันที่</label>
                                    <input
                                        id="spend_date"
                                        name="spend_date" 
                                        type="date"
                                        value={formData.spend_date}
                                        onChange={handleFormChange}
                                        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                </div>

                                <div className="flex space-x-3">
                                    <button
                                        type="submit"
                                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        {editingTransaction ? 'อัปเดต' : 'บันทึก'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={resetForm}
                                        className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors"
                                    >
                                        ยกเลิก
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Finance;