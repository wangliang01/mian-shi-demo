import Vue from 'vue'
import Router from 'vue-router'
import award from '@/components/award/award.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'award',
      component: award
    }
  ]
})
