// КОМПОНЕНТЫ
Vue.component('product', {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
    cart: {
      type: Array,
    },
  },
  template: `
  <div class="product">

    <div class="product-image">
      <img :src="image" />
    </div>

    <div class="product-info">
      <h1>{{ title }}</h1>
      <p v-if="inStock">In Stock</p>
      <p v-else>Out of Stock</p>
      <p>{{ sale }}</p>

      <p>Shipping: {{ shipping }}</p>

      <ul>
        <li v-for="(detail, index) in details" :key="index" @click="cons(detail)">{{ detail }}</li>
      </ul>

      <div class="color-box" v-for="(variant, index) in variants" 
        :key="variant.variantId"
        :style="{ backgroundColor: variant.variantColor }" 
        @mouseover="updateProduct(index)">
      </div>

      <button @click="addToCart" :disabled="!inStock" :class="{ disabledButton: !inStock }">
        Add to cart
      </button>

      <button @click="removeFromCart" :disabled="!cart.length" :class="{ disabledButton: !cart.length }">
        remove from cart
      </button>

      <product_tabs :reviews='reviews'></product_tabs>

    </div>

  </div>
  `,
  data() {
    return {
      product: 'Socks',
      brand: 'Vue Mastery',
      selectedVariant: 0,
      details: ['80% cotton', '20% polyester', 'Gender-neutral'],
      variants: [
        {
          variantId: 2234,
          variantColor: 'green',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg',
          variantQuantity: 10,
          onSale: true
        },
        {
          variantId: 2235,
          variantColor: 'blue',
          variantImage: 'https://www.vuemastery.com/images/challenges/vmSocks-blue-onWhite.jpg',
          variantQuantity: 0,
          onSale: false
        },
      ],
      reviews: [],
    }
  },
  methods: {
    addToCart: function () {
      this.$emit('add-to-cart', this.variants[this.selectedVariant].variantId)
    },
    removeFromCart: function () {
      this.$emit('remove-from-cart')
    },
    updateProduct: function (i) {
      this.selectedVariant = i
    },
    cons(arg) {
      console.log(arg)
    },
    addReview(productReview) {
      this.reviews.push(productReview)
      console.log(this.reviews)
    }
  },
  computed: {
    title() {
      return this.brand + ' ' + this.product
    },
    image() {
      return this.variants[this.selectedVariant].variantImage
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity
    },
    sale() {
      if (this.onSale) {
        return this.brand + ' ' + this.product + ' are on sale!'
      }
      return this.brand + ' ' + this.product + ' are not on sale'
    },
    shipping() {
      if (this.premium) {
        return 'Free'
      }
      return 2.99

    }
  }
})

Vue.component('product_tabs', {
  props: {
    reviews: {
      type: Array,
      required: false,
    }
  },
  template: `
  <div>

    <ul>
      <span 
        class='tab' 
        :class='{activeTab: selectedTab === tab}' 
        @click='selectedTab = tab' 
        v-for='(tab, index) in tabs'>
        {{ tab }}
      </span> 
    </ul>

    <div v-show=" selectedTab === 'Reviews' ">
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
        <li v-for="review in reviews">
          <p>{{ review.name }}</p>
          <p>Rating: {{ review.rating }}</p>
          <p>{{ review.review }}</p>
        </li>
      </ul>
      </div>

      <div v-show="selectedTab === 'Make a Reviews'">
        <product_review @review_submitted='addReview'></product_review>
      </div>

    </div>
  `,
  data() {
    return {
      tabs: ['Reviews', 'Make a Reviews'],
      selectedTab: 'Reviews'
    }
  }
})

Vue.component('product_review', {
  template: `
      <form class="review-form" @submit.prevent="onSubmit">
      
      <p v-if='errors.length'>
        <b>Please correct the following error(s):</b>
        <ul>
          <li v-for='error in errors'>{{error}}</li>
        </ul>
      </p>

      <p>
        <label for="name">Name:</label>
        <input id="name" v-model="name" placeholder="name">
      </p>

      <p>
        <label for="review">Review:</label>      
        <textarea id="review" v-model="review"></textarea>
      </p>

      <p>
        <label for="rating">Rating:</label>
        <select id="rating" v-model.number="rating">
          <option>5</option>
          <option>4</option>
          <option>3</option>
          <option>2</option>
          <option>1</option>
        </select>
      </p>

      <p>
        <input type="submit" value="Submit">  
      </p>    
  
    </form>
    `,
  data() {
    return {
      name: null,
      rating: null,
      review: null,
      errors: [],
    }
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
        }
        this.$emit('review_submitted', productReview)
        this.name = null
        this.review = null
        this.rating = null
      } else {
        if (!this.name)  this.errors.push('Name req!')
        if (!this.review) this.errors.push('review req!')
        if (!this.rating) this.errors.push('rating req!')
      }
    }
  }
}
)
// КОРЕНЬ ПРОЕКТА
var app = new Vue({
  el: '#app',
  data: {
    premium: true,
    cart: [],
  },
  methods: {
    updateCartUp(id) {
      this.cart.push(id)
    },
    updateCartDown() {
      this.cart.pop()
    }
  }
})