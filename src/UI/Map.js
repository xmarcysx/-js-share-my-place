export class Map {
  constructor(coords) {
    this.render(coords);
  }

  render(coords) {
    if (!google) {
      alert('Could not load maps library - please try later');
      return;
    }

    const map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: coords,
    });

    const marker = new google.maps.Marker({
      position: coords,
      map: map,
    });
  }
}
