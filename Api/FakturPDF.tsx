import React from 'react';
import { Alert, PermissionsAndroid, Platform, Linking } from 'react-native';
// @ts-expect-error
import RNHTMLtoPDF from 'react-native-html-to-pdf';
import RNFS from 'react-native-fs';

interface FakturData {
  faktur: string;
  tanggal: string;
  pelanggan: string;
  items: Array<{
    namabarang: string;
    qty: number;
    harga: number;
    subtotal: number;
  }>;
  totalBayar: number;
}

const requestStoragePermission = async () => {
  try {
    if (Platform.OS === 'android') {
      // Untuk Android versi 10 (API level 29) ke atas
      if (Platform.Version >= 29) {
        const permissions = [
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE
        ];

        const statuses = await PermissionsAndroid.requestMultiple(permissions);
        
        return (
          statuses[PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED &&
          statuses[PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE] === PermissionsAndroid.RESULTS.GRANTED
        );
      } 
      // Untuk Android versi di bawah 10
      else {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: "Izin Penyimpanan",
            message: "Aplikasi memerlukan izin untuk menyimpan faktur PDF",
            buttonNeutral: "Tanya Nanti",
            buttonNegative: "Batal",
            buttonPositive: "OK"
          }
        );

        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          console.warn('Izin penyimpanan ditolak');
          return false;
        }
        return true;
      }
    }
    return true; // Untuk iOS atau platform lain
  } catch (err) {
    console.error('Error saat meminta izin:', err);
    return false;
  }
};

export const generatePDF = async (data: FakturData) => {
  try {
    const hasPermission = await requestStoragePermission();
    if (!hasPermission) {
      Alert.alert(
        'Izin Diperlukan',
        'Aplikasi memerlukan izin untuk menyimpan faktur PDF. Silakan berikan izin di pengaturan aplikasi.',
        [
          { text: 'Batal', style: 'cancel' },
          { 
            text: 'Buka Pengaturan', 
            onPress: () => {
              if (Platform.OS === 'android') {
                Linking.openSettings();
              }
            }
          }
        ]
      );
      return null;
    }

    const htmlContent = `
      <html>
        <head>
          <style>
            @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap');
            
            body { 
              font-family: 'Poppins', sans-serif; 
              padding: 40px;
              background: #ffffff;
            }
            
            .header { 
              text-align: center; 
              margin-bottom: 40px;
              position: relative;
            }
            
            .header h1 {
              color: #2C3E50;
              font-size: 28px;
              margin: 10px 0;
              text-transform: uppercase;
              letter-spacing: 2px;
              font-weight: bold;
            }
            
            .header h2 {
              color: #34495E;
              font-size: 22px;
              font-weight: 500;
              margin-bottom: 20px;
            }
            
            .faktur-info {
              margin-bottom: 30px;
              padding: 15px;
              border: 1px solid #ddd;
              border-radius: 8px;
            }
            
            .faktur-info p {
              margin: 8px 0;
              color: #2C3E50;
              font-size: 14px;
            }
            
            table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 30px;
            }
            
            th {
              background: #6E8E59;
              color: white;
              padding: 12px;
              font-size: 14px;
              text-align: left;
              border: 1px solid #ddd;
            }
            
            td {
              padding: 10px 12px;
              border: 1px solid #ddd;
              font-size: 14px;
            }
            
            tr:nth-child(even) {
              background-color: #f9f9f9;
            }
            
            .total {
              text-align: right;
              margin-top: 20px;
              padding: 15px;
              background: #f8f9fa;
              border-radius: 8px;
            }
            
            .total p {
              color: #2C3E50;
              font-size: 18px;
              font-weight: 600;
              margin: 5px 0;
            }
            
            .decorative-line {
              height: 3px;
              background: linear-gradient(to right, #6E8E59, transparent);
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Faktur Penjualan</h1>
            <h2>Toko Kita</h2>
            <div class="decorative-line"></div>
          </div>
          
          <div class="faktur-info">
            <p><strong>No Faktur:</strong> ${data.faktur}</p>
            <p><strong>Tanggal:</strong> ${data.tanggal}</p>
            <p><strong>Pelanggan:</strong> ${data.pelanggan}</p>
          </div>

          <table>
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Qty</th>
                <th>Harga</th>
                <th>Subtotal</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map(item => `
                <tr>
                  <td>${item.namabarang}</td>
                  <td>${item.qty}</td>
                  <td>Rp ${item.harga.toLocaleString('id-ID')}</td>
                  <td>Rp ${item.subtotal.toLocaleString('id-ID')}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="total">
            <p>Total Pembayaran: Rp ${data.totalBayar.toLocaleString('id-ID')}</p>
          </div>
          
          <div class="decorative-line"></div>
        </body>
      </html>
    `;

    // Pastikan direktori Downloads ada
    if (Platform.OS === 'android') {
      const downloadDir = RNFS.DownloadDirectoryPath;
      const exists = await RNFS.exists(downloadDir);
      if (!exists) {
        try {
          await RNFS.mkdir(downloadDir);
        } catch (mkdirError) {
          console.error('Gagal membuat direktori Downloads:', mkdirError);
          Alert.alert('Error', 'Gagal membuat direktori Downloads');
          return null;
        }
      }
    }

    const options = {
      html: htmlContent,
      fileName: `Faktur_${data.faktur}`,
      directory: 'Documents',
    };

    const file = await RNHTMLtoPDF.convert(options);
    
    if (!file || !file.filePath) {
      console.error('Gagal membuat file PDF');
      Alert.alert('Error', 'Gagal membuat file PDF');
      return null;
    }

    try {
      const downloadPath = `${RNFS.DownloadDirectoryPath}/Faktur_${data.faktur}.pdf`;
      await RNFS.copyFile(file.filePath, downloadPath);
      await RNFS.unlink(file.filePath); // Hapus file sementara
      
      console.log('PDF berhasil disimpan di:', downloadPath);
      return downloadPath;
    } catch (copyError) {
      console.error('Error saat memindahkan file:', copyError);
      Alert.alert('Error', 'Gagal menyimpan PDF ke folder Downloads');
      return file.filePath;
    }
  } catch (error) {
    console.error('Error saat generate PDF:', error);
    Alert.alert('Error', 'Terjadi kesalahan saat membuat PDF');
    return null;
  }
}; 