// function checkTaboolaFlag() {
//   let getTaboolaId = document.querySelectorAll('#taboolaAds');
//   if (window._taboola === undefined) {
//     window.setTimeout(
//       checkTaboolaFlag,
//       500 /* this checks the flag every 500 milliseconds*/,
//     );
//   } else {
//     getTaboolaId.forEach((item) => {
//       _taboola.push({
//         mode: 'thumbnails-a1',
//         container: item.firstChild.id,
//         placement: 'Infinite Below Article 1',
//         target_type: 'mix',
//       });
//       _taboola.push({ flush: true });
//     });
//   }
// }
// checkTaboolaFlag();
