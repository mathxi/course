<template>
  <v-app dark>
    <v-navigation-drawer v-model="drawer" :mini-variant="miniVariant" :clipped="clipped" fixed app>
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="item.to" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
    </v-app-bar>
    <v-main>
      <v-container>
        <nuxt />
      </v-container>
    </v-main>
    <v-alert v-if="alert.value" transition="scroll-y-transition" type="error">{{alert.message}}</v-alert>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "Vuetify.js"
    };
  },
  computed: {
    alert() {
      const tempAlert = this.$store.state.storage.alert;
      if (tempAlert.value === true) {
        this.resetAlert();
      }
      return tempAlert;
    }
  },
  mounted() {
    console.log("state: ", this.$store.state);
  },
  methods: {
    delay: ms => new Promise(res => setTimeout(res, ms)),
    resetAlert: async function(time = 3000) {
      this.delay(time).then(() =>
        this.$store.commit("storage/alert", { value: false, message: "reset" })
      );
    }
  }
};
</script>
