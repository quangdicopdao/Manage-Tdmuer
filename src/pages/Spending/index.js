import className from 'classnames/bind';
import style from './Spending.module.scss';
import wallet from '~/assets/wallet.jpg';
import { useState, useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'chart.js/auto';
import {Chart, ArcElement} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { baseURL } from '~/utils/api';
import { useSelector } from 'react-redux';
import { formatISO } from 'date-fns';
import DatePicker from 'react-datepicker';
Chart.register(ArcElement)
const cx = className.bind(style);
function Spending() {

    const [spendings, setSpendings] = useState();
    const [showModal, setShowModal] = useState(false);
    const [totalAmount, setTotalAmount] = useState(0);
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState(0);
    const [spendingId, setSpendingId] = useState(null); // State mới để lưu ID của mục chi tiêu cần chỉnh sửa
    const [selectedDate, setSelectedDate] = useState(new Date());//chọn ngày
    const [categories, setCategories] = useState([]);
    const [selectedCategory, setSelectedCategory] = useState('');
    const [allspendings, setAllSpendings] = useState();
    // ví
    const [wallets, setWallets]= useState();
    const [initialBalance, setInitialBalance] = useState(0);
    const [showModalwallet, setShowModalwallet] = useState(false);
    const user = useSelector((state) => state.auth.login.currentUser);
    const accessToken = user.accessToken;
    const listRef = useRef(null);
    console.log("User:",user._id)

    //load dữ liệu ví
    const fetchDataWallet = async ()=>{
        try{
            const allwallet = await axios.get(baseURL+`spending/api/getAllWallet/${user._id}` );
            const allwalletData = allwallet.data;
            setWallets(allwalletData);
        } catch (error) {
            console.error('Error fetching wallet:', error);
        }
    }
    useEffect(() =>{
        fetchDataWallet();
    },[user._id, wallets]);
    const currentMonth = new Date().getMonth() + 1; // Lấy tháng hiện tại (tháng bắt đầu từ 0 nên cần cộng thêm 1)
    

    // Lọc danh sách ví để chỉ lấy ra các ví được tạo trong tháng hiện tại và của người dùng đang đăng nhập
    const walletsOfCurrentUserAndCurrentMonth = wallets?.find(wallet => {
        const walletMonth = new Date(wallet.createdAt).getMonth() + 1;
        return walletMonth === currentMonth && wallet.userId === user._id;
    });
    console.log("Dữ liệu ví tháng hiện tại:",walletsOfCurrentUserAndCurrentMonth)

    // tính số dư ví
// Thêm hàm để cập nhật số dư ví
const updateWalletBalance = () => {
    if (walletsOfCurrentUserAndCurrentMonth && allspendings) {
        // Tính tổng số tiền chi tiêu trong tháng hiện tại
        const totalSpendingInCurrentMonth = allspendings.reduce((total, spending) => {
            const spendingDate = new Date(spending.date);
            const currentMonth = new Date().getMonth();
            if (spendingDate.getMonth() === currentMonth) {
                return total + spending.amount;
            } else {
                return total;
            }
        }, 0);

        // Tính số dư ví mới
        const currentBalance = calculateWalletBalance(walletsOfCurrentUserAndCurrentMonth.Initialbalance, totalSpendingInCurrentMonth);

        // Cập nhật state số dư
        setTotalAmount(currentBalance);
    }
};

// Thêm useEffect để cập nhật số dư sau mỗi lần thêm, sửa hoặc xóa chi tiêu
useEffect(() => {
    updateWalletBalance();
}, [allspendings,wallets]);
        // Tạo hàm để tính số dư của ví
        const calculateWalletBalance = (initialBalance, totalSpending) => {
            return initialBalance - totalSpending;
        };
    
        // Trong useEffect, gọi hàm tính số dư khi dữ liệu thay đổi
        useEffect(() => {
            if (walletsOfCurrentUserAndCurrentMonth && allspendings) {
                // Tính tổng số tiền chi tiêu trong tháng hiện tại
                const totalSpendingInCurrentMonth = allspendings.reduce((total, spending) => {
                    const spendingDate = new Date(spending.date);
                    const currentMonth = new Date().getMonth();
                    if (spendingDate.getMonth() === currentMonth) {
                        return total + spending.amount;
                    } else {
                        return total;
                    }
                }, 0);
    
                // Gọi hàm tính số dư và cập nhật state
                const currentBalance = calculateWalletBalance(walletsOfCurrentUserAndCurrentMonth.Initialbalance, totalSpendingInCurrentMonth);
                setTotalAmount(currentBalance);
            }
        }, [walletsOfCurrentUserAndCurrentMonth, allspendings]);
        
    //load dữ liệu chi tiêu
    useEffect(() => {
        fetchData(selectedDate); // Gọi hàm fetchData khi component được tải lần đầu tiên và mỗi khi ngày được chọn thay đổi
    }, [user._id, selectedDate]);
    //get Spending
    const fetchData = async (date) => {
        try {
            const formattedDate = formatISO(date, { representation: 'date' });
            const spendingResponse = await axios.get(baseURL + `spending/api/getSpending/${user._id}?date=${formattedDate}`);
            const spendingsData = spendingResponse.data;
            
            // all data
            const categoryResponse = await axios.get(baseURL + 'spending/api/getcategory');
            const categoriesData = categoryResponse.data;
            // Kết hợp dữ liệu từ hai bảng spendings và categories
            const mergedData = spendingsData.map(spending => {
                const category = categoriesData.find(cat => cat._id === spending.categoryId);
                return {
                    ...spending,
                    categoryName: category ? category.name : 'Unknown Category' // Tên của category
                };
            });
            const allspendingResponse = await axios.get(baseURL + `spending/api/getAllSpending/${user._id}`);
            const allspendingsData = allspendingResponse.data;
            setSpendings(mergedData);
            //setTotalAmount(total); // Lưu tổng số tiền vào state
            setAllSpendings(allspendingsData);
        } catch (error) {
            console.error('Error fetching spendings:', error);
        }
    }
    
    console.log("Data Spending:", spendings);
    console.log("Data Spending date:", selectedDate);
    console.log("Data All Spending:", allspendings);
    console.log("Data All Wallet:", wallets);
    //get category
    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get(baseURL + 'spending/api/getcategory'); // Thay đổi đường dẫn API tương ứng
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    console.log("category:",categories)
    console.log("selectcategory:",selectedCategory)
    
    const handleAddSpending = () => {
        setShowModal(true); // Hiển thị modal khi nhấn nút "Thêm mới"
    };
    const handleAddWallet = () => {
        setShowModalwallet(true); // Hiển thị modal khi nhấn nút "Thêm mới"
    };
    const handleCloseModal = () => {
        setShowModal(false); // Ẩn modal khi nhấn nút "Đóng"
        setSelectedCategory('');
        setDescription('');
        setAmount(0);
        setSpendingId(null);
    };
    const handleCloseModalwallet = () => {
        setShowModalwallet(false); // Ẩn modal khi nhấn nút "Đóng"
    };
    const handleAddNewSpending = async () => {
        try {
            let response;
            if (spendingId) {
                // Nếu có spendingId tồn tại, thực hiện thao tác chỉnh sửa
                response = await axios.post(baseURL + `spending/api/updateSpending/${spendingId}`, {
                    
                    description: description,
                    amount: amount,
                    categoryId: selectedCategory
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            } else {
                // Ngược lại, thực hiện thao tác thêm mới
                response = await axios.post(baseURL + 'spending/api/createSpending', {
                    description: description,
                    amount: amount,  
                    categoryId: selectedCategory,
                    walletId: walletsOfCurrentUserAndCurrentMonth._id,
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }

            if (response.status === 201 || response.status === 200) {
                setSelectedDate(new Date());
                // Đóng modal và làm sạch dữ liệu nhập
                setShowModal(false);
                setSelectedCategory('');
                setDescription('');
                setAmount(0);
                setSpendingId(null);
                // Fetch dữ liệu mới với ngày hiện tại
                fetchData(new Date());
                alert("Thao tác thành công!!")
            } else {
                alert('Có lỗi xảy ra khi thực hiện thao tác.');
            }
        } catch (error) {
            console.error('Error performing operation:', error);
            alert('Có lỗi xảy ra khi thực hiện thao tác.');
        }
    };
    const handleAddNewWallet = async () =>{
        try {
            let response;
            response = await axios.post(baseURL + 'spending/api/createWallet', {
                Initialbalance: initialBalance,
                userId: user._id,  
            }, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            if (response.status === 201 || response.status === 200) {
                setShowModalwallet(false);
                fetchData(new Date());
                alert("Thao tác thành công!!")
            } else {
                alert('Có lỗi xảy ra khi thực hiện thao tác.');
            }
        } catch (error) {
            console.error('Error performing operation:', error);
            alert('Có lỗi xảy ra khi thực hiện thao tác.');
        }
    }
    const handleEditSpending = (spending) => {
        // Set các giá trị của mục chi tiêu vào state khi bấm vào biểu tượng sửa
        setSelectedCategory(spending.categoryId)
        setDescription(spending.description);
        setAmount(spending.amount);
        setSpendingId(spending._id);
        setShowModal(true);
    };
    const handleDeleteSpending = async (spendingId) => {
        try {
            const response = await axios.delete(baseURL + `spending/api/deleteSpending/${spendingId}`,{
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
    
            if (response.status === 200) {
                // Xóa khoản chi tiêu khỏi danh sách hiện tại
                setSpendings(spendings.filter(spending => spending._id !== spendingId));
                updateWalletBalance();
                fetchData(selectedDate);
                alert("Xóa thành công!!")
                // Gửi thông báo hoặc cập nhật giao diện nếu cần
            } else {
                alert('Có lỗi xảy ra khi xóa khoản chi.');
            }
        } catch (error) {
            console.error('Error deleting spending:', error);
            alert('Có lỗi xảy ra khi xóa khoản chi.');
        }
    };
    const handleDatePickerChange = (date) => {
        setSelectedDate(date); // Cập nhật ngày được chọn từ DatePicker vào state
    };

    // Xử lý biểu đồ

    // Sử dụng hook useState để lưu trữ dữ liệu cho biểu đồ
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Spending',
                data: [],
                backgroundColor: '#FF6384', // Màu nền cho biểu đồ
                hoverBackgroundColor: '#FF6384', // Màu nền khi di chuột qua
            },
            {
                label: 'Spending',
                data: [],
                backgroundColor: '#FF6384', // Màu nền cho biểu đồ
                hoverBackgroundColor: '#FF6384', // Màu nền khi di chuột qua
            },
        ],
    }); 

    // Tạo state để lưu trữ số dư ví theo tháng
const [monthlyBalances, setMonthlyBalances] = useState([]);

// Tính toán số dư của ví cho từng tháng và cập nhật state monthlyBalances
useEffect(() => {
    if (wallets && allspendings) {
        const monthlyBalances = Array.from({ length: 12 }, () => null); // Mảng chứa số dư của ví cho từng tháng, ban đầu là null

        wallets.forEach(wallet => {
            const walletMonth = new Date(wallet.createdAt).getMonth(); // Lấy tháng của ví
            const walletBalance = wallet.Initialbalance; // Lấy số dư của ví
            monthlyBalances[walletMonth] = walletBalance; // Lưu số dư vào mảng theo tháng
        });

        // Cập nhật state monthlyBalances
        setMonthlyBalances(monthlyBalances);
    }
}, [wallets, allspendings]);

console.log("số dư:",monthlyBalances);
    // Sử dụng hook useEffect để cập nhật dữ liệu cho biểu đồ
    useEffect(() => {
        if (Array.isArray(allspendings)) {
            // Tạo mảng chứa tổng số tiền chi tiêu cho mỗi tháng, ban đầu có giá trị 0 cho tất cả các tháng
            const monthlySpending = Array.from({ length: 12 }, () => 0);

            // Tính tổng số tiền chi tiêu cho mỗi tháng từ dữ liệu allspendings
            allspendings.forEach(spending => {
                const month = new Date(spending.date).getMonth(); // Lấy tháng từ ngày của mỗi khoản chi tiêu
                monthlySpending[month] += spending.amount; // Cộng số tiền chi tiêu vào tháng tương ứng
            });

            // Tạo mảng labels cho biểu đồ với tên các tháng
            const labels = Array.from({ length: 12 }, (_, i) => {
                return `${i + 1}`;
            });
            // Tạo mảng backgroundColors cho các cột trong biểu đồ
            const backgroundColors = monthlySpending.map(amount => {
                return amount > walletsOfCurrentUserAndCurrentMonth?.Initialbalance ? '#FF0000' : '#36A2EB'; // Sử dụng màu đỏ nếu chi tiêu > 500000, ngược lại sử dụng màu xanh
            });
            // Cập nhật dữ liệu cho biểu đồ
            setChartData({
                labels: labels,
                datasets: [
                    {
                        label: 'Chi tiêu',
                        data: monthlySpending,
                        backgroundColor: backgroundColors,
                        hoverBackgroundColor: backgroundColors,
                        // Thêm cấu trúc thông tin để hiển thị tổng chi tiêu và trạng thái
                        hoverOffset: 6, // Khoảng cách di chuột khi hiển thị tooltip
                        hoverBorderColor: 'black', // Màu viền khi hover
                        hoverBorderWidth: 2, // Độ dày viền khi hover
                        // Sử dụng hàm tooltip để tùy chỉnh nội dung của tooltip
                        tooltip: {
                            enabled: true,
                            callbacks: {
                                label: function(context) {
                                    const monthIndex = context.dataIndex; // Chỉ số của tháng
                                    const total = context.dataset.data[monthIndex]; // Tổng chi tiêu của tháng
                                    wallets.forEach(wallet => {
                                        const walletMonth = new Date(wallet.createdAt).getMonth(); // Lấy tháng của ví
                                        const walletBalance = wallet.Initialbalance; // Lấy số dư của ví
                                        monthlyBalances[walletMonth] = walletBalance; // Lưu số dư vào mảng theo tháng
                                    });
                                    const initialBalance = monthlyBalances[monthIndex]; // Số dư của ví cho tháng đó
                                    const status = total > initialBalance ? 'Chi tiêu không tốt' : 'Chi tiêu tốt';
                                    const balance = parseInt(initialBalance) - parseInt(total);
                                    return [`Số dư ban đầu: ${initialBalance?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`,`Tổng chi tiêu: ${total?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`,`Còn dư: ${balance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}`, status];
                                    
                                }
                            }
                        }
                    },
                ],
            });
        }
    }, [allspendings]);
    // Biểu đồ sẽ được cập nhật mỗi khi dữ liệu allspendings thay đổi

    return (
        <div className={cx('wrapper')}>
            <div className={cx('header-info')}>
                <img src={wallet} alt="ví tiền" className={cx('img-wallet')} />
                <div className={cx('wrap-money')}>
                    <span className={cx('title-money')}>Ví: <span style={{ fontWeight: 500, color: "#73a656" }}>{walletsOfCurrentUserAndCurrentMonth?.Initialbalance ? walletsOfCurrentUserAndCurrentMonth.Initialbalance.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) : '0₫'}</span></span>
                    <span style={{fontWeight:600}}>Số dư: <span className={cx('money')}>{totalAmount?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span></span>

                </div>
                {walletsOfCurrentUserAndCurrentMonth ? (
                    <button className={cx('spending-button')} onClick={handleAddSpending}>
                        Thêm khoản chi
                        <FontAwesomeIcon icon={faPlus} className={cx('icon-add')} />
                    </button>
                ) : (
                    <button className={cx('spending-button')} onClick={handleAddWallet}>
                        Tạo ví
                        <FontAwesomeIcon icon={faPlus} className={cx('icon-add')} />
                    </button>
                )}
            </div>
            <div className={cx('wrap-datepicker')}>
                <DatePicker
                    selected={selectedDate}
                    onChange={handleDatePickerChange}
                    dateFormat="dd/MM/yyyy"
                    className={cx('datepicker')}
                />
            </div>
            <div className={cx('grid')}>
                <div className={cx('col-7')}>
                    {spendings?.length > 0 ? (
                        spendings.map((spending, index) => (
                            <div key={index} className={cx('new-spend')}>
                                <div className={cx('wrap-icon')}>
                                    <FontAwesomeIcon icon={faPenToSquare} className={cx('icon-edit')} onClick={()=>handleEditSpending(spending)}/>
                                    <FontAwesomeIcon icon={faTrash} className={cx('icon-trash')} onClick={() => handleDeleteSpending(spending._id)} />
                                </div>
                                <div className={cx('wrap-content')}>
                                    <div className={cx('wrap-header')}>
                                        <h3 className={cx('title-spend')}>{spending.categoryName}</h3>
                                        <span className={cx('content-spend')}>{spending.description}</span>
                                    </div>
                                    <span className={cx('money-spend')}>{spending.amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className={cx('no-spending')}>
                            Hiện tại chưa có khoản chi
                        </div>
                    )}
                </div>
                <div className={cx('col-6')}>
                    <div style={{}}>
                        Biểu đồ thống kê theo từng tháng (đơn vị VNĐ)
                    </div>
                    <div>

                    </div>
                    <div>
                        <Bar 
                            data={chartData} 
                            options={{
                                plugins: {
                                    legend: {
                                        labels: {
                                            generateLabels: function(chart) {
                                                const labels = [];
                                                labels.push({
                                                    text: 'Chi tiêu tốt',
                                                    fillStyle: '#36A2EB', // Thay đổi từ color sang fillStyle
                                                });
                                                labels.push({
                                                    text: 'Chi tiêu không tốt',
                                                    fillStyle: '#FF0000', // Thay đổi từ color sang fillStyle
                                                });
                                                return labels;
                                            }
                                        }
                                    }
                                }
                            }} 
                        />
                    </div>
                </div>
            </div>
        {/**Modal */}
        {showModal && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-container')}>
                        <h2>{spendingId ? 'Cập nhật khoản chi' : 'Thêm khoản chi mới'}</h2>
                        <div className={cx('input-container')}>
                        <label htmlFor="category" className={cx('input-label')}>
                            Loại chi tiêu:
                        </label>
                        <select
                            id="category"
                            className={cx('input-field')}
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                        >
                            <option value="">Select a category</option>
                            {categories.map((category) => (
                                <option key={category._id} value={category._id}>{category.name}</option>
                            ))}
                        </select>
                        </div>
                        <div className={cx('input-container')}>
                            <label htmlFor="description" className={cx('input-label')}>
                                Mô tả:
                            </label>
                            <input
                                type="text"
                                id="description"
                                className={cx('input-field')}
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>
                        <div className={cx('input-container')}>
                            <label htmlFor="amount" className={cx('input-label')}>
                                Khoản chi:
                            </label>
                            <input
                                type="number"
                                id="amount"
                                className={cx('input-field')}
                                value={amount}
                                onChange={(e) => setAmount(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className={cx('modal-button-container')}>
                            <button className={cx('modal-button')} onClick={handleCloseModal}>
                                Đóng
                            </button>
                            <button className={cx('modal-button')} onClick={handleAddNewSpending}>
                                Lưu
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showModalwallet && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-container')}>
                        <h2>Tạo ví mới</h2>
                        <div className={cx('input-container')}>
                            <label htmlFor="amount" className={cx('input-label')}>
                                Số dư ban đầu:
                            </label>
                            <input
                                type="number"
                                id="amount"
                                className={cx('input-field')}
                                value={initialBalance}
                                onChange={(e) => setInitialBalance(parseFloat(e.target.value))}
                            />
                        </div>
                        <div className={cx('modal-button-container')}>
                            <button className={cx('modal-button')} onClick={handleCloseModalwallet}>
                                Đóng
                            </button>
                            <button className={cx('modal-button')} onClick={handleAddNewWallet}>
                                Tạo
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Spending;
