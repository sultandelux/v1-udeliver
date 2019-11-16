<template>
  <div class="courier-buttons">
    <v-dialog
      v-model="dialog"
      persistent
      max-width="290"
    >
      <v-btn
        slot="activator"
        color="success"
      >Accept '{{ name }}' to You!</v-btn>
      <v-card>
        <v-card-title class="headline">Accept '{{ name }}' to You!</v-card-title>
        <v-card-text>If you click on the Button 'Accept' you will accept {{ name }} to you.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
            color="red darken-1"
            flat
            @click="dialog = false"
          >Cancel</v-btn>
          <v-btn
            color="green darken-1"
            flat
            @click="handleCallClicked"
          >Accept</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-btn
      disabled
      color="error"
    >Report courier</v-btn>
  </div>
</template>

<script>
export default {
  props: ['name'],
  data() {
    return {
      dialog: false
    };
  },
  methods: {
    handleCallClicked() {
      this.dialog = false;
      // TODO:
    }
  }
};
</script>
