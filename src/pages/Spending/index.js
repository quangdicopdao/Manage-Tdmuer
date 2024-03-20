import className from 'classnames/bind';
import style from './Spending.module.scss';
import wallet from '~/assets/wallet.jpg';
import { useState, useEffect,useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import 'chart.js/auto';
import {Chart, ArcElement} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import { baseURL } from '~/utils/api';
import { useSelector } from 'react-redux';
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
    const user = useSelector((state) => state.auth.login.currentUser);
    const accessToken = user.accessToken;
    const listRef = useRef(null);
    console.log("User:",user._id)

    useEffect(() => {
        fetchData(selectedDate); // Gọi hàm fetchData khi component được tải lần đầu tiên và mỗi khi ngày được chọn thay đổi
    }, [user._id, selectedDate]);
    //get Spending
    const fetchData = async (date) => {
        try {
            const spendingResponse = await axios.get(baseURL + `spending/api/getSpending/${user._id}?date=${date.toISOString()}`);
            const spendingsData = spendingResponse.data;

            // all data
            let total = 0; // Khởi tạo biến tổng số tiền
            const categoryResponse = await axios.get(baseURL + 'spending/api/getcategory');
            const categoriesData = categoryResponse.data;
            // Kết hợp dữ liệu từ hai bảng spendings và categories
            const mergedData = spendingsData.map(spending => {
                const category = categoriesData.find(cat => cat._id === spending.categoryId);
                total += spending.amount;
                return {
                    ...spending,
                    categoryName: category ? category.name : 'Unknown Category' // Tên của category
                };
            });
            const allspendingResponse = await axios.get(baseURL + `spending/api/getAllSpending/${user._id}`);
            const allspendingsData = allspendingResponse.data;
            setSpendings(mergedData);
            setTotalAmount(total); // Lưu tổng số tiền vào state
            setAllSpendings(allspendingsData);
        } catch (error) {
            console.error('Error fetching spendings:', error);
        }
    }
    
    console.log("Data Spending:", spendings);
    console.log("Data Spending date:", selectedDate);
    console.log("Data All Spending:", allspendings);
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
    // Tạo dữ liệu cho biểu đồ tròn
    // const chartData = {
    //     labels: ['Food', 'Transport', 'Entertainment', 'Others'],
    //     datasets: [
    //         {
    //             label: 'Spending',
    //             data: [200, 150, 100, 50], // Dữ liệu thể hiện số tiền chi tiêu trong mỗi lĩnh vực
    //             backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED'],
    //             hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED'],
    //         },
    //     ],
    // };
    const handleAddSpending = () => {
        setShowModal(true); // Hiển thị modal khi nhấn nút "Thêm mới"
    };
    const handleCloseModal = () => {
        setShowModal(false); // Ẩn modal khi nhấn nút "Đóng"
        setSelectedCategory('');
        setDescription('');
        setAmount(0);
        setSpendingId(null);
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
                    userId: user._id,
                    categoryId: selectedCategory
                }, {
                    headers: {
                        Authorization: `Bearer ${accessToken}`
                    }
                });
            }

            if (response.status === 201 || response.status === 200) {
                setShowModal(false);
                fetchData(selectedDate);
                setSelectedCategory('');
                setDescription('');
                setAmount(0);
                setSpendingId(null);
                alert("Thao tác thành công!!")
            } else {
                alert('Có lỗi xảy ra khi thực hiện thao tác.');
            }
        } catch (error) {
            console.error('Error performing operation:', error);
            alert('Có lỗi xảy ra khi thực hiện thao tác.');
        }
    };
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

    // Hàm này nhận vào mảng spendings và mảng categories, sau đó tính tổng amount cho mỗi danh mục và trả về một đối tượng mới có labels là tên của category và data là tổng amount
    const calculateTotalAmountByCategory = (spendings, categories) => {
        if (!spendings || !categories) return { labels: [], data: [] };
    
        const categoryMap = {};
    
        // Khởi tạo categoryMap với các danh mục và tổng số tiền ban đầu bằng 0
        categories.forEach(category => {
            categoryMap[category.name] = 0;
        });
    
        // Tính tổng số tiền cho mỗi danh mục từ tất cả các khoản chi
        spendings.forEach(spending => {
            const categoryName = categories.find(cat => cat._id === spending.categoryId)?.name;
            if (categoryName) {
                categoryMap[categoryName] += spending.amount;
            }
        });
    
        // Tạo mảng labels từ các tên danh mục và mảng data từ các tổng số tiền
        const labels = Object.keys(categoryMap);
        const data = labels.map(categoryName => categoryMap[categoryName]);
    
        return { labels, data };
    };
    
    
    // Sử dụng hàm calculateTotalAmountByCategory để tạo chartData
    const updateChartData = (spendings, categories) => {
        const { labels, data } = calculateTotalAmountByCategory(spendings, categories);
    
        return {
            labels,
            datasets: [
                {
                    label: 'Spending',
                    data,
                    backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED','#00FF00'], // Có thể thay đổi màu sắc tùy ý
                    hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#E7E9ED','#00FF00'],
                },
            ],
        };
    };
    
    // Sử dụng hàm updateChartData để cập nhật chartData
    const [chartData, setChartData] = useState(updateChartData(allspendings, categories));

    // Cập nhật chartData mỗi khi allSpendings hoặc categories thay đổi
    useEffect(() => {
        setChartData(updateChartData(allspendings, categories));
        console.log('Chart Data:',chartData)
    }, [allspendings, categories]);
    
    return (
        <div className={cx('wrapper')}>
            <div className={cx('header-info')}>
                <img src={wallet} alt="ví tiền" className={cx('img-wallet')} />
                <div className={cx('wrap-money')}>
                    <span className={cx('title-money')}>Tổng chi tiêu</span>
                    <span className={cx('money')}>{totalAmount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}</span>
                </div>
                <button className={cx('spending-button')} onClick={handleAddSpending}>
                    Thêm khoản chi
                     <FontAwesomeIcon icon={faPlus} className={cx('icon-add')} />
                </button>
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
                {spendings?.map((spending, index) => (
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
                    ))}
                </div>
                <div className={cx('col-3')}>
                    <div>
                    <Doughnut data={chartData} />{/* Render biểu đồ trực tiếp */}
                    </div>
                </div>
            </div>

        {/**Modal */}
        {showModal && (
                <div className={cx('modal-overlay')}>
                    <div className={cx('modal-container')}>
                        <h2>Thêm khoản chi mới</h2>
                        <div className={cx('input-container')}>
                        <label htmlFor="category" className={cx('input-label')}>
                            Category:
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
                                Description:
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
                                Amount:
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
        </div>
    );
}

export default Spending;
