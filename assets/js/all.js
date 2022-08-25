"use strict";

//首頁-商品輪播圖
$(document).ready(function () {
  new Swiper('.swiper-container', {
    loop: true,
    nextButton: '.swiper-button-next',
    prevButton: '.swiper-button-prev',
    slidesPerView: 3,
    paginationClickable: true,
    spaceBetween: 20,
    breakpoints: {
      1920: {
        slidesPerView: 4,
        spaceBetween: 30
      },
      1028: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      480: {
        slidesPerView: 1,
        spaceBetween: 10
      }
    }
  });
}); //漢堡選單點擊

$(document).ready(function () {
  $('.hamburger').click(function () {
    $(this).toggleClass('open');
  });
}); //AJAX 大全

var productWrap = document.querySelector('.shop-product-list');
var orderWrap = document.querySelector('.orderWrap');
var spentWrap = document.querySelector('.spentWrap');
var deleteWrap = document.querySelector('.cartList');
var qtyWrap = document.querySelector('.qtyWrap');
var deleteAllBtn = document.querySelector('.deleteAllBtn'); //列表元素

var cartList = document.querySelector('.cartList');
var orderInfor = document.querySelector('.orderInfor');
var orderTable = document.querySelector('.orderTable');
var orderCheck = document.querySelector('.orderCheck');
var cartFinal = document.querySelector('.cart-final');
var cartTotal = document.querySelector('.cart-finalprice');
var orderFinal = document.querySelector('.order-cart-final');
var orderPaid = document.querySelector('.order-paid'); //表單元素

var formName = document.querySelector('.form-name');
var formEmail = document.querySelector('.form-email');
var formTel = document.querySelector('.form-tel');
var formAddress = document.querySelector('.form-address');
var formPayway = document.querySelector('.form-payWay');
var formMessage = document.querySelector('.form-message');
var cartData = [];
var productData = [];
var orderData = [];
var cartPrice = "";
var orderPrice = "";
var order = [];
var orderID = sessionStorage.getItem('ID'); // let cartId = [];

var products = [];
var product = [];
var productList = [];
getProduct();
getCartList();
getOrderList(); //取得商品列表

function getProduct() {
  var api = "https://vue3-course-api.hexschool.io/api/item666/products/all";
  axios.get(api).then(function (res) {
    productData = res.data.products;
    renderPage(1);
  })["catch"](function (err) {
    console.log(err);
  });
} // //商品渲染
// function renderData(data) {
//     let str ="";
//     productData.forEach(item =>{
//     str += `<li class="shop-product-item mb-4">
//                 <img src="${item.imageUrl}" alt="">
//                 <div class="shop-product-text">
//                     <h3>${item.title}</h3>
//                 </div>
//                 <div class="shop-product-price d-flex justify-content-around px-3 pt-1 pb-3">
//                     <h3>${item.price}</h3>
//                     <a href="#" class="add-btn" id="addCardBtn" data-id="${item.id}">
//                         <img src="./assets/images/cart.png" alt="cart">加入購物車
//                     </a>
//                 </div>
//             </li>`;
//     })
//     productWrap.innerHTML = str;
// }
//取得訂單


function getCartList() {
  var url = "https://vue3-course-api.hexschool.io/api/item666/cart";
  axios.get(url).then(function (res) {
    cartData = res.data.data.carts;
    cartPrice = res.data.data.final_total; //console.log(cartData);

    renderCarts();
    renderFinalPrice();
    renderCartInfor();
  })["catch"](function (err) {
    console.log(err);
  });
} //加入購物車 按鈕


productWrap.addEventListener("click", function (e) {
  e.preventDefault();
  var addCartClass = e.target.getAttribute('class');

  if (addCartClass !== 'add-btn') {
    console.log('沒點到');
    return;
  }

  ;
  var productId = e.target.getAttribute('data-id'); //console.log(productId);

  var numCheck = 1;
  cartData.forEach(function (item) {
    if (item.id === productId) {
      numCheck = item.qty += 1;
    }
  });
  var url = "https://vue3-course-api.hexschool.io/api/item666/cart";
  axios.post(url, {
    data: {
      "product_id": productId,
      "qty": numCheck
    }
  }).then(function (res) {
    console.log(res.data);
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '成功加入購物車',
      showConfirmButton: false,
      timer: 1500
    });
    getCartList();
  })["catch"](function (err) {
    console.log(err);
  });
}); //渲染購物車

function renderCarts() {
  var str = "";
  cartData.forEach(function (item) {
    str += "<li class=\"cart-item border-bottom border-third pb-2\">\n                    <div class=\"cart-item-title ms-2 ps-2\">\n                        <img src=\"".concat(item.product.imageUrl, "\" alt=\"cart-photo\">\n                        <h3 class=\"pt-1\">").concat(item.product.title, "</h3>\n                    </div>\n                    <div class=\"cart-item ps-4\">\n                        <div class=\"qtyWrap d-inline-block d-flex\">\n                            <button type=\"button\" item-Id=").concat(item.id, " data-num=").concat(item.qty, "\n                                    class=\"cart-minusBtn\">\n                                -\n                            </button>\n                            <span type=\"number\" id=\"number\"\n                                    class=\"px-2 d-flex justify-content-center align-items-center border border-third\">\n                                    ").concat(item.qty, "\n                            </span>\n                            <button type=\"button\" item-Id=").concat(item.id, " data-num=").concat(item.qty, "\n                                    class=\"cart-addBtn\">\n                                +\n                            </button>\n                        </div>\n                    </div>\n                    <div class=\"cart-item ps-4\">\n                        <h3>").concat(item.total, "</h3>\n                    </div>\n                    <div class=\"cart-icon\">\n                        <a href=\"#\" class=\"cart-delete bg-danger rounded-circle\">\n                            <img src=\"./assets/images/delete.png\" alt=\"delete\" data-id=").concat(item.id, ">\n                        </a>\n                    </div>\n                </li>");
  });
  cartList.innerHTML = str;
  $('.cart-addBtn').on('click', function () {
    adjustQty();
  });
  $('.cart-minusBtn').on('click', function () {
    adjustQty();
  });

  function adjustQty() {
    cartList.addEventListener("click", function (e) {
      var itemNum = e.target.getAttribute('data-num');
      var patchId = e.target.getAttribute('item-Id');
      var btnClass = e.target.getAttribute('class');

      if (btnClass == 'cart-addBtn') {
        itemNum++;
        console.log(itemNum);
        console.log(patchId);
        var url = "https://vue3-course-api.hexschool.io/api/item666/cart/".concat(patchId);
        axios.put(url, {
          data: {
            product_id: patchId,
            qty: itemNum
          }
        }).then(function (res) {
          if (res.data.success) {
            console.log(res.data);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '成功調整購物車數量',
              showConfirmButton: false,
              timer: 1500
            });
            setTimeout(function () {
              getCartList();
            }, 1600);
          } else {
            console.log(res);
          }
        })["catch"](function (err) {
          console.log(err.message);
        });
      } else if (btnClass == 'cart-minusBtn') {
        itemNum--;

        if (itemNum < 1) {
          Swal.fire({
            icon: 'error',
            title: '已達購物車最低數量'
          });
          var minusBtn = document.querySelector(".cart-minusBtn");
          minusBtn.disabled = true;
          return;
        }

        var _url = "https://vue3-course-api.hexschool.io/api/item666/cart/".concat(patchId);

        axios.put(_url, {
          data: {
            product_id: patchId,
            qty: itemNum
          }
        }).then(function (res) {
          if (res.data.success) {
            console.log(res.data);
            Swal.fire({
              position: 'center',
              icon: 'success',
              title: '成功調整商品數量',
              showConfirmButton: false,
              timer: 1500
            });
            setTimeout(function () {
              getCartList();
            }, 1600);
          } else {
            console.log(res);
          }
        })["catch"](function (err) {
          console.log(err.message);
        });
      }
    });
  }
}

cartList.addEventListener("click", function (e) {
  e.preventDefault();
  var cartID = e.target.getAttribute('data-id');
  console.log(cartID);
  deleteCart(cartID);
}); //刪除單個購物車

function deleteCart(cartID) {
  var url = "https://vue3-course-api.hexschool.io/api/item666/cart/".concat(cartID);
  axios["delete"](url).then(function (res) {
    if (res.data.success) {
      getCartList();
    } else {
      console.log(res.data.message);
    }
  })["catch"](function (err) {
    console.log(err.message);
  });
} //刪除全部購物車


deleteAllBtn.addEventListener("click", function (e) {
  e.preventDefault();
  var url = "https://vue3-course-api.hexschool.io/api/item666/carts";
  axios["delete"](url).then(function (res) {
    if (res.data.success) {
      console.log(res.data);
      Swal.fire({
        position: 'center',
        icon: 'success',
        title: '成功清除全部購物車',
        showConfirmButton: false,
        timer: 1500
      });
      getCartList();
    } else {
      console.log(res.data.message);
    }
  })["catch"](function (err) {
    console.log(err.message);
  });
}); //渲染訂單資訊

function renderCartInfor() {
  var str = "";
  cartData.forEach(function (item) {
    str += "<div class=\"order-list border-bottom border-third\">\n                    <li class=\"order-image\">\n                        <img src=\"".concat(item.product.imageUrl, "\" alt=\"cart-photo\">\n                    </li>\n                    <li class=\"order-title\">\n                        <h3>").concat(item.product.title, "</h3>\n                    </li>\n                    <li class=\"order-qty\"><h3>").concat(item.qty, "</h3></li>\n                    <li class=\"order-price\"><h3>").concat(item.total, "</h3></li>\n                </div>");
  });
  orderInfor.innerHTML = str;
} //渲染訂單最後價格


function renderFinalPrice() {
  var item = cartPrice;
  var str = "";
  str += "<span class=\"cart-totalprice\">NT$ ".concat(item, "</span>");
  cartFinal.innerHTML = str;
  var word = "";
  word += "<span class=\"cart-totalprice\">NT$ ".concat(item, "</span>");
  cartTotal.innerHTML = word;
} //建立訂單


function createOrder() {
  var form = {
    user: {},
    message: ""
  };
  form.user.name = formName.value.trim();
  form.user.email = formEmail.value.trim();
  form.user.tel = formTel.value.trim();
  form.user.address = formAddress.value.trim();
  form.user.payWay = formPayway.value;
  form.message = formMessage.value;
  var url = "https://vue3-course-api.hexschool.io/api/item666/order";
  var order = form;
  axios.post(url, {
    data: order
  }).then(function (res) {
    if (res.data.success) {
      console.log(res.data);
      orderID = res.data.orderId;
      sessionStorage.setItem('ID', "".concat(res.data.orderId));
      self.location.href = "payOrder.html";
      getCartList(); //getOrderList();
    } else {
      console.log(res.data);
    }
  })["catch"](function (err) {
    console.log(err);
  });
}

; //取得單筆創建的訂單

function getOrderList() {
  var url = "https://vue3-course-api.hexschool.io/api/item666/order/".concat(orderID);
  axios.get(url).then(function (res) {
    if (res.data.success) {
      products = [];
      order = res.data.order;
      orderData = res.data.order;
      orderPrice = res.data.order.total; //console.log(res.data.order.products);
      //console.log(orderData.message);

      Object.entries(order.products).forEach(function (item) {
        products.push(item);
      }); //console.log(products);

      renderOrders();
      renderOrderCheck();
      renderOrderPrice();
      renderOrderPaid();
    } else {
      console.log('error');
      console.log(res.data.message);
    }
  })["catch"](function (err) {
    console.log(err);
  });
} //渲染訂單資訊


function renderOrders() {
  var str = "";
  var item = orderData;

  if (orderData.message == undefined) {
    str += "\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u8A02\u55AE\u7DE8\u865F:</th>\n            <td>".concat(item.id, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u8A02\u55AE\u65E5\u671F:</th>\n            <td>").concat(item.create_at, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u6536\u4EF6\u4EBA\u59D3\u540D:</th>\n            <td>").concat(item.user.name, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u6536\u4EF6\u4EBA\u4FE1\u7BB1:</th>\n            <td>").concat(item.user.email, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u6536\u4EF6\u4EBA\u96FB\u8A71:</th>\n            <td>").concat(item.user.tel, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u6536\u4EF6\u4EBA\u5730\u5740:</th>\n            <td>").concat(item.user.address, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u904B\u9001\u65B9\u5F0F:</th>\n            <td>").concat(item.user.payWay, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u5099\u8A3B:</th>\n            <td class=\"text-gary\">\u7121\u586B\u5BEB</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u7E3D\u91D1\u984D:</th>\n            <td class=\"fw-bold\">").concat(item.total, "</td>\n        </tr>");
  } else {
    str += "\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u8A02\u55AE\u7DE8\u865F:</th>\n            <td>".concat(item.id, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u8A02\u55AE\u65E5\u671F:</th>\n            <td>").concat(item.create_at, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u6536\u4EF6\u4EBA\u59D3\u540D:</th>\n            <td>").concat(item.user.name, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u6536\u4EF6\u4EBA\u4FE1\u7BB1:</th>\n            <td>").concat(item.user.email, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u6536\u4EF6\u4EBA\u96FB\u8A71:</th>\n            <td>").concat(item.user.tel, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u6536\u4EF6\u4EBA\u5730\u5740:</th>\n            <td>").concat(item.user.address, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u904B\u9001\u65B9\u5F0F:</th>\n            <td>").concat(item.user.payWay, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u5099\u8A3B:</th>\n            <td>").concat(item.message, "</td>\n        </tr>\n        <tr class=\"order-infor-item d-flex justify-content-between\">\n            <th>\u7E3D\u91D1\u984D:</th>\n            <td class=\"fw-bold\">").concat(item.total, "</td>\n        </tr>");
  }

  orderTable.innerHTML = str;
}

; //渲染訂單付款狀態

function renderOrderPaid() {
  var str = ""; //console.log(orderData.is_paid);

  if (orderData.is_paid == true) {
    str += "<tr class=\"order-infor-item d-flex justify-content-between\">\n                    <th>\u4ED8\u6B3E\u72C0\u614B:</th>\n                    <td class=\"text-success d-flex align-items-center\">\n                        <p class=\"pe-2\">\u4ED8\u6B3E\u6210\u529F</p>\n                        <img src=\"./assets/images/check-circle.png\" alt=\"icon\" class=\"bg-success rounded-circle\">\n                    </td>\n                </tr>";
  } else {
    str += " <tr class=\"order-infor-item d-flex justify-content-between\">\n                    <th>\u4ED8\u6B3E\u72C0\u614B:</th>\n                    <td class=\"text-danger d-flex align-items-center\">\n                        <p class=\"pe-2\">\u5C1A\u672A\u4ED8\u6B3E</p>\n                        <img src=\"./assets/images/close-circle-outline.png\" alt=\"icon\" class=\"bg-danger rounded-circle\">\n                    </td>\n                </tr>";
  }

  orderPaid.innerHTML = str;
} //渲染訂單頁最後價格


function renderOrderPrice() {
  var str = "";
  var item = orderPrice;
  str += "<span class=\"cart-totalprice\">NT$ ".concat(item, "</span>");
  orderFinal.innerHTML = str;
} //渲染訂單資訊


function renderOrderCheck() {
  var str = "";
  products.forEach(function (item) {
    str += "<ul class=\"d-flex justify-content-around align-items-center border-bottom border-third\">\n                    <li class=\"order-image w-25 ps-3\">\n                        <img src=\"".concat(item[1].product.imageUrl, "\" alt=\"order-photo\">\n                    </li>\n                    <li class=\"w-25 text-center\">").concat(item[1].product.title, "</li>\n                    <li class=\"w-25 text-center ps-2\">").concat(item[1].qty, "</li>\n                    <li class=\"w-25 text-center ps-2\">").concat(item[1].total, "</li>\n                </ul>");
  });
  orderCheck.innerHTML = str;
}

; //付款

function payOrder() {
  var url = "https://vue3-course-api.hexschool.io/api/item666/pay/".concat(orderID);
  axios.post(url).then(function (res) {
    console.log(res);
    getOrderList();
  })["catch"](function (err) {
    console.log(err);
  });
}

; //付款 按鈕

spentWrap.addEventListener("click", function (e) {
  e.preventDefault();
  var payClass = e.target.getAttribute('class');

  if (payClass !== "payBtn") {
    console.log("沒點到");
    return;
  } else {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '付款成功',
      showConfirmButton: false,
      timer: 1500
    });
    setTimeout(function () {
      self.location.href = "checkoutOrder.html";
    }, 1500);
    payOrder();
    console.log("付款成功");
  }
}); //表單驗證 

var input = document.querySelectorAll('input[name]');
var constraints = {
  "姓名": {
    presence: {
      message: "欄位 必填!"
    }
  },
  "電話": {
    presence: {
      message: "欄位 必填!"
    },
    length: {
      onlyInteger: true,
      minimum: 8,
      greaterThanOrEqualTo: 8,
      lessThanOrEqualTo: 10,
      message: "必須符合10字數"
    }
  },
  "Email": {
    presence: {
      message: "欄位 必填!"
    },
    email: {
      message: "錯誤格式"
    }
  },
  "寄送地址": {
    presence: {
      message: "欄位 必填!"
    }
  },
  "付款方式": {
    presence: {
      message: "欄位 必填!"
    }
  }
};
input.forEach(function (item) {
  item.addEventListener('change', function () {
    item.nextElementSibling.textContent = '';
    var errors = validate(orderInfoForm, constraints);

    if (errors) {
      Object.keys(errors).forEach(function (keys) {
        document.querySelector("[data-message=".concat(keys, "]kjashjhafkj")).textContent = errors[keys];
      });
    }
  });
}); //表單送出

var orderInfoForm = document.querySelector('.orderInfo-form');
var orderInfoBtn = document.querySelector('.orderInfo-btn');
orderInfoBtn.addEventListener('click', function (e) {
  e.preventDefault();

  if (cartData.length == 0) {
    alert('請加入購物車');
    return;
  }

  var errors = validate(orderInfoForm, constraints);

  if (errors) {
    Object.keys(errors).forEach(function (keys) {
      document.querySelector("[data-message=".concat(keys, "]")).textContent = errors[keys];
    });
  } else {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title: '訂單成立',
      showConfirmButton: false,
      timer: 1500
    });
    createOrder();
  }
}); // 整體分頁功能

var page = document.querySelector('.pages');

function renderPage(nowPage) {
  var dataPerPage = 6;
  var totalPages = Math.ceil(productData.length / dataPerPage);
  var minData = dataPerPage * nowPage - dataPerPage + 1;
  var maxData = dataPerPage * nowPage; //console.log('minData', minData, 'maxData', maxData);
  // 頁數資訊

  var pageInfo = {
    totalPages: totalPages,
    // 總頁數
    nowPage: nowPage,
    // 當前頁數
    isFirst: nowPage == 1,
    // 是否為第一頁
    isLast: nowPage == totalPages // 是否為最後一頁

  }; // 取出當前頁數的資料

  var currentData = [];
  productData.forEach(function (item, index) {
    if (index + 1 >= minData && index + 1 <= maxData) {
      currentData.push(item); //console.log(currentData);
    }
  }); //商品渲染

  function renderData(productData) {
    var str = "";
    productData.forEach(function (item) {
      str += "<li class=\"shop-product-item mb-4\">\n                <img src=\"".concat(item.imageUrl, "\" alt=\"\">\n                <div class=\"shop-product-text\">\n                    <h3>").concat(item.title, "</h3>\n                </div>\n                <div class=\"shop-product-price d-flex justify-content-around px-3 pt-1 pb-3\">\n                    <h3>").concat(item.price, "</h3>\n                    <a href=\"#\" class=\"add-btn\" id=\"addCardBtn\" data-id=\"").concat(item.id, "\">\n                        <img src=\"./assets/images/cart.png\" alt=\"cart\">\u52A0\u5165\u8CFC\u7269\u8ECA\n                    </a>\n                </div>\n            </li>");
    });
    productWrap.innerHTML = str;
  }

  renderData(currentData);
  renderPageBtn(pageInfo);
}

page.addEventListener('click', function (e) {
  e.preventDefault;
  console.log('click', e.target.nodeName);

  if (e.target.nodeName != 'A') {
    return;
  }

  var clickPage = e.target.dataset.page;
  console.log(clickPage);
  renderPage(clickPage);
});
var productSideList = document.querySelector(".shop-side-list");
productSideList.addEventListener("click", function (e) {
  var catelogValue = e.target.getAttribute('value');

  if (catelogValue == "全部商品") {
    renderPage(1); // 點選按鈕切換頁面

    page.addEventListener('click', function (e) {
      e.preventDefault;
      console.log('click', e.target.nodeName);

      if (e.target.nodeName != 'A') {
        return;
      }

      var clickPage = e.target.dataset.page;
      console.log(clickPage);
      renderPage(clickPage);
    });
    return;
  } else {
    var renderSelect = function renderSelect(nowPage) {
      var dataPerPage = 6;
      var totalPages = Math.ceil(selectNum.length / dataPerPage);
      var minData = dataPerPage * nowPage - dataPerPage + 1;
      var maxData = dataPerPage * nowPage; //console.log('minData', minData, 'maxData', maxData);
      // 頁數資訊

      var pageInfo = {
        totalPages: totalPages,
        // 總頁數
        nowPage: nowPage,
        // 當前頁數
        isFirst: nowPage == 1,
        // 是否為第一頁
        isLast: nowPage == totalPages // 是否為最後一頁

      }; // 取出當前頁數的資料

      var currentData = [];
      productData.forEach(function (item, index) {
        if (index + 1 >= minData && index + 1 <= maxData) {
          currentData.push(item); ///console.log(currentData);
        }
      }); //商品渲染

      function renderSeclectData() {
        var str = '';
        productData.forEach(function (item) {
          if (catelogValue == item.category) {
            console.log(catelogValue);
            str += "<li class=\"shop-product-item mb-4\">\n                                <img src=\"".concat(item.imageUrl, "\" alt=\"\">\n                            <div class=\"shop-product-text\">\n                                <h3>").concat(item.title, "</h3>\n                            </div>\n                            <div class=\"shop-product-price d-flex justify-content-around px-3 pt-1 pb-3\">\n                                <h3>").concat(item.price, "</h3>\n                                <a href=\"#\" class=\"add-btn\" id=\"addCardBtn\" data-id=\"").concat(item.id, "\">\n                                    <img src=\"./assets/images/cart.png\" alt=\"cart\">\u52A0\u5165\u8CFC\u7269\u8ECA\n                                </a>\n                            </div>\n                            </li>");
          }

          productWrap.innerHTML = str;
        });
      }

      renderSeclectData(currentData);
      renderPageBtn(pageInfo);
    };

    var selectNum = document.querySelectorAll(".shop-product-item");
    renderSelect(1);
    page.addEventListener('click', function (e) {
      e.preventDefault;
      console.log('clickJOJO', e.target.nodeName);

      if (e.target.nodeName != 'A') {
        return;
      }

      var clickPage = e.target.dataset.page;
      console.log(clickPage);
      renderSelect(clickPage);
    });
  }
}); // 渲染分頁按鈕

function renderPageBtn(pageInfo) {
  var str = "";
  var totalPages = pageInfo.totalPages; //console.log(totalPages);

  if (pageInfo.isFirst) {
    str += "\n        <li class=\"page-item disabled\">\n            <a class=\"page-link\" href=\"#\">\n                \u25C0\n            </a>\n        </li>\n        ";
  } else {
    str += "\n        <li class=\"page-item\">\n            <a class=\"page-link\" href=\"#\" aria-label=\"Previous\" data-page=\"".concat(Number(pageInfo.nowPage) - 1, "\">\n                \u25C0\n            </a>\n        </li>\n        ");
  } // 第 2 ~


  for (var i = 1; i <= totalPages; i++) {
    if (Number(pageInfo.nowPage) == i) {
      str += "\n            <li class=\"page-item active\" aria-current=\"page\">\n            <a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a>\n            </li>\n        ");
    } else {
      str += "\n            <li class=\"page-item\" aria-current=\"page\">\n            <a class=\"page-link\" href=\"#\" data-page=\"".concat(i, "\">").concat(i, "</a>\n            </li>\n        ");
    }
  } // 是不是最後一頁


  if (pageInfo.isLast) {
    str += "\n        <li class=\"page-item disabled\">\n            <a class=\"page-link\" href=\"#\">\n                \u25B6\n            </a>\n        </li>\n        ";
  } else {
    str += "\n        <li class=\"page-item\">\n            <a class=\"page-link\" href=\"#\" aria-label=\"Next\" data-page=\"".concat(Number(pageInfo.nowPage) + 1, "\">\n                \u25B6   \n            </a>\n        </li>\n        ");
  }

  page.innerHTML = str;
}
//# sourceMappingURL=all.js.map
