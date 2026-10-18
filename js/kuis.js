
document.addEventListener('DOMContentLoaded', function () {
    // Mengambil identitas siswa dari sessionStorage
    const nama = sessionStorage.getItem('excelStartNama');
    const kelas = sessionStorage.getItem('excelStartKelas');

    // Pastikan identitas sudah diisi
    if (!nama || !kelas) {
        alert('Silakan isi identitas siswa terlebih dahulu.');
        window.location.replace('identitas.html');
        return;
    }

    document.getElementById('studentName').textContent = nama;
    document.getElementById('studentClass').textContent = kelas;

    const form = document.getElementById('quizForm');
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('progressFill');
    const progressBar = document.getElementById('progressBar');
    const completionText = document.getElementById('completionText');

    const totalSoal = 10;

    // Kunci jawaban 10 soal
    const kunciJawaban = {
        q1: 'A',
        q2: 'B',
        q3: 'C',
        q4: 'D',
        q5: 'A',
        q6: 'B',
        q7: 'C',
        q8: 'D',
        q9: 'A',
        q10: 'B'
    };

    // Memperbarui progres pengerjaan
    function updateProgress() {
        let terjawab = 0;

        for (let i = 1; i <= totalSoal; i++) {
            const pilihan = form.querySelector(
                `input[name="q${i}"]:checked`
            );

            if (pilihan) {
                terjawab++;
            }
        }

        const persen = (terjawab / totalSoal) * 100;

        progressText.textContent =
            `${terjawab} dari ${totalSoal} soal`;

        progressFill.style.width = `${persen}%`;
        progressBar.setAttribute('aria-valuenow', terjawab);

        completionText.textContent =
            terjawab === totalSoal
                ? 'Semua soal sudah dijawab. Kamu siap melihat hasilnya!'
                : `Kamu sudah menjawab ${terjawab} dari ${totalSoal} soal.`;
    }

    // Progres berubah ketika siswa memilih jawaban
    form.addEventListener('change', updateProgress);

    // Memproses jawaban saat formulir dikirim
    form.addEventListener('submit', async function (event) {
        event.preventDefault();

        const jawaban = {};
        const belumDijawab = [];

        // Memeriksa apakah semua soal telah dijawab
        for (let i = 1; i <= totalSoal; i++) {
            const pilihan = form.querySelector(
                `input[name="q${i}"]:checked`
            );

            if (!pilihan) {
                belumDijawab.push(i);
            } else {
                jawaban[`q${i}`] = pilihan.value;
            }
        }

        // Mencegah pengiriman jika masih ada soal kosong
        if (belumDijawab.length > 0) {
            alert(
                'Masih ada soal yang belum dijawab: ' +
                belumDijawab.join(', ') +
                '. Silakan lengkapi terlebih dahulu.'
            );

            const soalPertama = form.querySelector(
                `input[name="q${belumDijawab[0]}"]`
            );

            soalPertama.closest('.question-card').scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            soalPertama.focus({ preventScroll: true });
            return;
        }

        // Menghitung jumlah jawaban benar
        let benar = 0;

        for (let i = 1; i <= totalSoal; i++) {
            if (jawaban[`q${i}`] === kunciJawaban[`q${i}`]) {
                benar++;
            }
        }

        // Setiap jawaban benar bernilai 10 poin
        const skor = benar * 10;

        // Menyiapkan data hasil evaluasi
        const hasil = {
            nama: nama,
            kelas: kelas,
            jawaban: jawaban,
            benar: benar,
            total: totalSoal,
            skor: skor,
            tanggal: new Date().toLocaleDateString('id-ID')
        };

        // Menyimpan hasil agar dapat dibaca halaman hasil.html
        sessionStorage.setItem(
            'excelStartHasil',
            JSON.stringify(hasil)
        );

        // Mengirim nilai ke Google Sheets
        // Pastikan sheets.js dimuat sebelum kuis.js
        if (typeof kirimNilaiKeSheets === 'function') {
            await kirimNilaiKeSheets(hasil);
        } else {
            console.error(
                'Fungsi kirimNilaiKeSheets tidak ditemukan. Periksa sheets.js.'
            );
        }

        // Membuka halaman hasil evaluasi
        window.location.href = 'hasil.html';
    });

    // Menampilkan progres awal
    updateProgress();
});
