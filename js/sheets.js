
const SCRIPT_URL =
  'https://script.google.com/a/macros/student.uns.ac.id/s/AKfycby7rRfU_ekaeKFL3lWEAmTLL7H585hIRy1_RP4o3hqM2dfq8F6IbL8rlzMEQNx95LrMSw/exec';

async function kirimNilaiKeSheets(hasil) {
  const dataKirim = {
    nama: hasil.nama,
    kelas: hasil.kelas,
    benar: hasil.benar,
    total: hasil.total,
    skor: hasil.skor,
    tanggal: hasil.tanggal
  };

  try {
    await fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'text/plain;charset=utf-8'
      },
      body: JSON.stringify(dataKirim)
    });

    console.log('Permintaan pengiriman nilai sudah dikirim.');
    return true;
  } catch (error) {
    console.error('Pengiriman nilai gagal:', error);
    return false;
  }
}
