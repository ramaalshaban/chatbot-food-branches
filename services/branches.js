const branches = [
    { name: 'Beşiktaş',location: 'Beşiktaş', products: { 'Kebap': 50, 'Lahmacun': 20, 'Baklava': 30, 'Pide': 25, 'Döner': 40 } },
    { name: 'Kadıköy',location: 'Kadıköy', products: { 'Kebap': 55, 'Lahmacun': 22, 'Baklava': 32, 'Çiğ Köfte': 18, 'Döner': 42 } },
    { name: 'Karaköy',location: 'Karaköy', products: { 'Kebap': 52, 'Lahmacun': 21, 'Baklava': 31, 'Börek': 15, 'Döner': 41 } },
    { name: 'Üsküdar',location: 'Üsküdar', products: { 'Kebap': 53, 'Lahmacun': 23, 'Baklava': 33, 'Gözleme': 24, 'Döner': 43 } },
    { name: 'Taksim', location: 'Taksim',products: { 'Kebap': 54, 'Lahmacun': 24, 'Baklava': 34, 'Kumpir': 28, 'Döner': 44 } }
  ];
  
  function getBranches() {
    return branches;
  }
  
  function getBranchNames() {
    return branches.map(branch => branch.name);
  }
  
  module.exports = { getBranches, getBranchNames };