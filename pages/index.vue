<template>
  <div id="container_lists">
    <v-btn @click="newList()" color="primary">New list</v-btn>
    <v-btn @click="addAlert()" color="primary">Alert</v-btn>
    <v-btn @click="removeAlert()" color="primary">remove Alert</v-btn>
    <div class="lists">
      <v-card :elevation="4" dark class="list_item" v-for="list in lists" :key="list.id">
        <v-card-title class="headline">
          {{list.title}}
          <v-spacer />
          <v-icon @click="removeList(list)">far fa-trash-alt</v-icon>
        </v-card-title>

        <v-list>
          <v-list-item v-for="elem in list.elems" :key="elem.id" class="list__elem">
            <v-list-item-content class="list_elem_item" @click="clickElemList(elem)">
              <v-list-item-title v-text="elem.libelle"></v-list-item-title>
            </v-list-item-content>

            <v-list-item-icon class="list_elem_item_remove" @click="removeListElement(elem)">
              <v-icon>fas fa-times</v-icon>
            </v-list-item-icon>
          </v-list-item>
        </v-list>
        <v-divider />
        <v-card-actions>
          <v-row>
            <v-col cols="10" class="flex-grow-1 flex-shrink-0">
              <v-text-field v-model="list.newElem" placeholder="New element" />
            </v-col>
            <v-col
              cols="2"
              class="d-flex flex-grow-0 flex-shrink-1 align-item-center justify-content-center"
            >
              <v-icon @click="addElem(list)">fas fa-plus</v-icon>
            </v-col>
          </v-row>
        </v-card-actions>
      </v-card>
    </div>
    <v-progress-circular v-if="loading" :size="50" color="amber" indeterminate></v-progress-circular>
  </div>
</template>

<script>
import axios from "axios";
export default {
  data: () => {
    return {
      lists: [],
      loading: false
    };
  },
  methods: {
    changeLoadState: function(value) {
      this.loading = value;
      return this.loading;
    },
    removeList: function(list) {
      console.log("deleting", list.id);
      axios({
        method: "delete",
        url: "http://localhost:3800/listes",
        data: {
          id: list.id
        }
      }).then(response => {
        if (response.status === 200) {
          this.lists.splice(this.lists.indexOf(list), 1);
        } else {
          this.addAlert();
        }
      });
    },
    newList: function() {
      axios
        .post("http://localhost:3800/listes", { titre: "New List" })
        .then(response => {
          this.lists.push({
            id: response.data.id,
            title: response.data.titre,
            elems: []
          });
        });
    },
    clickElemList: function(elem) {
      console.log("click", elem);
    },
    removeListElement: function(elem) {
      console.log("remove", elem);
    },
    addElem: function(list) {
      console.log("LIST ADD ELEM", list);
      axios({
        method: "post",
        url: "http://localhost:3800/elemlist",
        data: {
          libelle: list.newElem,
          id_liste: list.id
        }
      }).then(response => {
        const list = this.lists.find(current => {
          console.log(current.id, response);

          return current.id === response.data.id_liste;
        });
        list.elems.push(response.data);
      });
    },
    getAllListElem: function() {
      axios
        .get("http://localhost:3800/listes/elems")
        .then(response => {
          this.changeLoadState(true);
          this.lists.splice(this.lists.indexOf(list), 1);

          const newList = response.data.map(current => {
            const elems = current.liste_elems.map(currentElem => {
              return {
                id: currentElem.id,
                libelle: currentElem.libelle,
                id_liste: currentElem.id_liste
              };
            });
            return {
              id: current.id,
              title: current.titre,
              elems
            };
          });
          console.log("newList", newList);
          this.changeLoadState(false);
          this.lists = newList;
        })
        .catch(error => this.addAlert());
    },
    addAlert(message = "error") {
      this.$store.commit("storage/alert", { value: true, message: message });
    },
    removeAlert(message = "error") {
      console.log(message);
      this.$store.commit("storage/alert", { value: false, message: message });
    }
  },
  mounted() {
    this.getAllListElem();
  }
};
</script>

<style lang="scss">
#container_lists {
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
}
.lists {
  display: flex;
  justify-content: center;
  margin-top: 30px;
  flex-wrap: wrap;
}
.list_item {
  margin: 20px 50px;
  min-width: 400px;
  .list_elem_item:hover {
    background-color: rgba(171, 171, 171, 6%);
    cursor: pointer;
  }
}
.list_elem_item_remove:hover {
  transition: all ease 0.5s;
  i {
    text-shadow: 0px 0px 16px #5d5d5d;
  }
  transform: scale(1.1);
}
</style>
