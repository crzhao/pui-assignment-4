var storage = window.localStorage;
/** Data of different products */
var init = function() {
  /** set up an array for product for detail and cart page */
  var products = [
  { id: 1, image: "pic_square2.jpg", price: 9.99, shape: "square" },
  { id: 2, image: "pic_round2.jpg", price: 10.99, shape: "round" },
  { id: 3, image: "pic_bear2.jpg", price: 15.99, shape: "bear" },
  { id: 4, image: "pic_bunny2.jpg", price: 25.99, shape: "bunny" },
  { id: 5, image: "pic_cat2.jpg", price: 20.99, shape: "cat" },
  { id: 6, image: "pic_dog2.jpg", price: 14.99, shape: "dog" },
  { id: 7, image: "pic_custom2.jpg", price: 29.99, shape: "custom" },
]

  var data = JSON.stringify(products);
  storage.setItem('products', data);
  $(document).ready(function() {
    changeCartCount();
    for (i = 0; i < cartCount(); i++) {
      appendDataToTable(JSON.parse(storage.getItem("carts"))[i]);
    }
  });

}
init();

/** Count the quantity of items in cart */
var cartCount = function() {
  carts = JSON.parse(storage.getItem("carts"));
  return (carts == null) ? 0 : carts.length;
}

/** Add products from detail pages to the cart */
var addCart = function() {
  if (document.getElementById("selection").options[document.getElementById("selection").selectedIndex].text === "---") {
    alert("Choose the shape first!");
    return;
  }
  var carts = JSON.parse(storage.getItem("carts")) || []
  var selected = document.getElementById("selection").value;
  var json_products = JSON.parse(storage.getItem("products"))
  var selected_object = json_products.find(function(e) {
    return e.shape === selected
  })
  selected_object.quantity = parseInt(document.getElementById("quantity_selection").value);
  var dup_object = carts.find(function(e) {
    return e.shape === selected
  })
  if (carts != [] && dup_object) {
    carts = carts.filter(function(el) {
      return el.shape !== selected;
    });
    selected_object = grouped_data(selected_object, dup_object);
  }
  carts.push(selected_object)
  data = JSON.stringify(carts);
  storage.setItem('carts', data);
  document.getElementById("cartCount").innerText = cartCount();
}

var grouped_data = function(selected_object, dup_object) {
  selected_object.quantity = parseInt(selected_object.quantity) + parseInt(dup_object.quantity);
  return selected_object;
}

/** Remove product from the cart */
var removeItem = function(id) {
  str = 'product_' + id
  document.getElementById(str).remove();
  var carts = JSON.parse(storage.getItem("carts"))
  var removedList = carts.filter(function(el) {
    return el.id !== id;
  });
  data = JSON.stringify(removedList);
  storage.setItem('carts', data);
  changeCartCount();
  changeSubtotal();
}

/** Add products to the cart */
var appendDataToTable = function(data) {
  var image = data.image;
  var shape = data.shape;
  var id = data.id;
  var price = data.price;
  var quantity = data.quantity;
  var sum = (price * quantity).toFixed(2);
  var id = data.id;
  var strHtml = "";
  strHtml += '<tr id=product_' + id + ">" + '<td class="cart-td-1"><input name="cartCheckBox" type="checkbox" value="product1" onclick="selectSingle()" /></td> <td class="cart-td-2">';
  strHtml += "<img src=" + "images/" + image + ">";
  strHtml += "</td>";
  strHtml += '<td class="cart-td-3"> <a href="#">Couch Pillow</a>';
  strHtml += '</td> <td class="cart-td-4">Shape: ' + shape + '</td>';
  strHtml += '<td class="cart-td-5">' + price + '</td>；'
  strHtml += '<td class="cart-td-6"><img src="images/icon_minus.svg" alt="minus" onclick="changeNum(' + '\'num_' + id + '\',\'minus\',' + id + ')" class="hand"/><input id="num_' + id + '" type="text" value="' + quantity + '" class="quant-input" readonly="readonly"/><img src="images/icon_add.svg" alt="add" ';
  strHtml += 'onclick="changeNum(' + '\'num_' + id + '\',\'add\',' + id + ')"';
  strHtml += 'class="hand"/></td><td class="cart-td-7">' + sum + '</td><td class="cart-td-8"><a href="javascript:removeItem(' + id + ');">Delete</a></td>'
  strHtml += "</tr>";
  $("#cart_items").append(strHtml);
}

/** Change information of the detail page when selecting different shapes */
var changeContent = function() {
  var selected = document.getElementById("selection").value;
  var json = JSON.parse(storage.getItem("products"))
  document.getElementById("product-detail").src = "images/" + json.find(function(e) {
    return e.shape === selected
  }).image; //change the images
  document.getElementById("price-num").innerText = "$" + json.find(function(e) {
    return e.shape === selected
  }).price; //change the price
};

/** Change the quantity of products in cart page */

function changeNum(numId, flag, id) {
  var numId = document.getElementById(numId);
  if (flag == "minus") { //minus one
    if (numId.value <= 1) {
      alert("The quantity should be bigger than 0");
      return false;
    } else {
      numId.value = parseInt(numId.value) - 1;
    }
  } else { //add one
    numId.value = parseInt(numId.value) + 1;
  }

  //update the cart item
  var carts = JSON.parse(storage.getItem("carts"))
  var selected = carts.find(function(e) {
    return e.id === id
  })
  selected.quantity = numId.value
  var removedList = carts.filter(function(el) {
    return el.id !== id;
  });
  removedList.push(selected)
  data = JSON.stringify(removedList);
  storage.setItem("carts", data);

  str = 'product_' + id
  document.getElementById(str).children[6].innerText = (selected.price * selected.quantity).toFixed(2)
  changeSubtotal();
}

/** Calulate the subtotal of all products in cart */
var subtotal = function() {
  total = 0
  table = document.getElementById('shopping')
  for (var i = 1; i < table.rows.length; i++) {
    total += parseFloat(table.rows[i].cells[6].innerHTML);
  }
  return total.toFixed(2)
};

var changeSubtotal = function() {
  document.getElementById("subtotal").innerText = subtotal();
}

/** Change the quantity of cart icon */
var changeCartCount = function() {
  document.getElementById("cartCount").innerText = cartCount();
}

/** Carousel in the detail page */
var toggleCarousel = function() {
  if ($("#carousel-1").hasClass("hide")) {
    $("#carousel-1").removeClass("hide")
    $("#carousel-2").addClass("hide")
  } else {
    $("#carousel-2").removeClass("hide")
    $("#carousel-1").addClass("hide")
  }
}
