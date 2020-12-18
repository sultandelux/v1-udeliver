<template>
  <div class="information container">
    <h1>Information about courier in your near</h1>
    <v-data-table
      :headers="headers"
      :items="courier"
      item-key="name"
      class="elevation-1"
    >
      <template
        slot="items"
        slot-scope="props"
      >
        <tr @click="props.expanded = !props.expanded">
          <td>
            <v-avatar
              :size="65"
              color="grey lighten-4"
            >
              <img
                :src="props.item.avatar"
                alt="avatar"
              >
            </v-avatar>
            {{ props.item.name }}
          </td>
          <td class="text-xs-right">{{ props.item.distance }}</td>
          <td class="text-xs-right">{{ props.item.price }} KZT</td>
          <td class="text-xs-right">{{ props.item.car }}</td>
        </tr>
      </template>
      <template
        slot="expand"
        slot-scope="props"
      >
        <v-card flat>
          <v-card-text>
            <CourierButtons :name="props.item.name" />
          </v-card-text>
        </v-card>
      </template>
    </v-data-table>
  </div>
</template>

<script>
import CourierButtons from '../components/Courier/CourierButtons';

export default {
  name: 'Information',
  components: {
    CourierButtons
  },
  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name'
        },
        { text: 'Distance', value: 'distance', align: 'right' },
        { text: 'Price (KZT)', value: 'price', align: 'right' },
        { text: 'Car', value: 'car', align: 'right' }
      ],
      courier: [
        {
          value: false,
          name: 'Peter Gregon',
          avatar: 'https://randomuser.me/api/portraits/men/44.jpg',
          distance: 3.75,
          price: 450,
          car: 'Mercedes'
        },
        {
          value: false,
          name: 'Alex Grosh',
          avatar: 'https://randomuser.me/api/portraits/men/18.jpg',
          distance: 1.09,
          price: 375,
          car: 'Bentley'
        },
        {
          value: false,
          name: 'Ryan McLey',
          avatar: 'https://randomuser.me/api/portraits/men/28.jpg',
          distance: 2,
          price: 500,
          car: 'Mercedes'
        }
      ]
    };
  }
};
</script>

<style lang="scss">
.information {
  .v-avatar {
    margin: 10px;
  }

  h1 {
    color: gray;
    margin-bottom: 20px;
  }
}
</style>
