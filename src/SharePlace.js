import { Modal } from './UI/Modal';
import { Map } from './UI/Map';
import { getCoordsFromAddress } from './Utility/Location';

class PlaceFinder {
  constructor() {
    const addressForm = document.querySelector('form');
    const locateUserBtn = document.getElementById('locate-btn');

    locateUserBtn.addEventListener('click', this.locateUserHandler.bind(this));
    addressForm.addEventListener('submit', this.findAddressHandler.bind(this));
  }

  selectPlace(coordinates) {
    if (this.map) {
      this.map.render(coordinates);
    } else {
      this.map = new Map(coordinates);
    }
    fetch('http://localhost:3000/add-location', {
      method: 'POST',
      body: JSON.stringify({
        lat: coordinates.lat,
        lng: coordinates.lng,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        console.log(data);
      });
  }

  locateUserHandler() {
    if (!navigator.geolocation) {
      alert('Location feature is not available in your browser');
      return;
    }
    const modal = new Modal(
      'loading-modal-content',
      'Loading location - please wait'
    );
    modal.show();
    setTimeout(() => {
      navigator.geolocation.getCurrentPosition(
        (successResult) => {
          modal.hide();
          const coordinates = {
            lat: successResult.coords.latitude,
            lng: successResult.coords.longitude,
          };
          console.log(coordinates);
          this.selectPlace(coordinates);
        },
        (error) => {
          modal.hide();
          alert('Could not locate you. Please enter an address manually!');
          return;
        }
      );
    }, 1000);
  }

  async findAddressHandler(event) {
    event.preventDefault();
    const address = event.target.querySelector('input').value;
    if (!address || address.trim().length === 0) {
      alert('Invalid address - please try again');
      return;
    }
    const modal = new Modal(
      'loading-modal-content',
      'Loading location - please wait'
    );
    modal.show();
    setTimeout(async () => {
      const coordinates = await getCoordsFromAddress(address);
      this.selectPlace(coordinates);
      modal.hide();
    }, 1000);
  }
}

new PlaceFinder();
