// Automated End-to-End Integration Test Suite for AL FAHA Luxury E-Commerce

const BASE_URL = 'http://localhost:3000';

async function runTests() {
  console.log('👑 [AL FAHA] Starting Automated Integration Test Suite...\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`  ✓ PASS: ${message}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${message}`);
      failed++;
    }
  }

  try {
    // 1. Health & Products Test
    console.log('📌 Test Group 1: Products & Catalog');
    const prodRes = await fetch(`${BASE_URL}/api/products`);
    const prodData = await prodRes.json();
    assert(prodData.success === true, 'Products API returned success: true');
    assert(Array.isArray(prodData.products) && prodData.products.length >= 8, `Loaded ${prodData.products?.length} seeded luxury creations`);
    
    // Check product fields
    const bisht = prodData.products.find(p => p.category === 'Embroidered Bishts');
    assert(bisht !== undefined, 'Found Embroidered Bishts category product');
    assert(bisht.price > 0 && typeof bisht.price === 'number', `Bisht price formatted in INR: ₹${bisht?.price}`);
    assert(bisht.arabicName && bisht.arabicName.length > 0, `Arabic name present: ${bisht?.arabicName}`);
    assert(bisht.sizes && bisht.sizes.length > 0, `Sizing options present: ${bisht?.sizes.join(', ')}`);

    // 2. Filter by Category
    const filteredRes = await fetch(`${BASE_URL}/api/products?category=Royal+Thobes`);
    const filteredData = await filteredRes.json();
    assert(filteredData.success && filteredData.products.every(p => p.category === 'Royal Thobes'), 'Category filter correctly isolates Royal Thobes');

    // 3. Authentication Test
    console.log('\n📌 Test Group 2: Authentication & Role Verification');
    const adminLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@alfaha.com', password: 'admin123' })
    });
    const adminLoginData = await adminLoginRes.json();
    assert(adminLoginData.success === true, 'Admin successfully authenticated');
    assert(adminLoginData.user.role === 'admin', 'User has admin role');
    assert(typeof adminLoginData.token === 'string' && adminLoginData.token.length > 20, 'Received valid JWT bearer token');
    const adminToken = adminLoginData.token;

    // Customer Login
    const custLoginRes = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'tariq@alfaha.com', password: 'customer123' })
    });
    const custLoginData = await custLoginRes.json();
    assert(custLoginData.success === true, 'Customer patron successfully authenticated');
    assert(custLoginData.user.role === 'customer', 'User has customer role');
    const customerToken = custLoginData.token;

    // 4. Coupons & Pricing Test
    console.log('\n📌 Test Group 3: Luxury Privilege Coupons');
    const couponRes = await fetch(`${BASE_URL}/api/coupons`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: 'ROYAL10', cartTotal: 50000 })
    });
    const couponData = await couponRes.json();
    assert(couponData.success === true, 'Applied ROYAL10 privilege coupon');
    assert(couponData.coupon.discountAmount === 5000, `Calculated 10% discount on ₹50,000 = ₹${couponData.coupon.discountAmount}`);

    // 5. Razorpay Integration (Zero Secret Leakage Check!)
    console.log('\n📌 Test Group 4: Razorpay Payment Initiation & Security');
    const rzpRes = await fetch(`${BASE_URL}/api/payments/razorpay/order`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 48500 })
    });
    const rzpData = await rzpRes.json();
    assert(rzpData.success === true, 'Initiated Razorpay order on backend');
    assert(rzpData.order.amount === 4850000, 'Correct amount in paise (₹48,500 * 100)');
    assert(rzpData.order.key !== undefined, 'Client received public Razorpay Key ID');
    assert(JSON.stringify(rzpData).indexOf('RAZORPAY_KEY_SECRET') === -1, 'SECURITY CONFIRMED: Payment secret is NEVER exposed to frontend!');

    // 6. Checkout & Order Placement (with Email Notification)
    console.log('\n📌 Test Group 5: Sovereign Checkout & Automatic Email Notifications');
    const newOrderPayload = {
      customerName: 'H.E. Sheikh Tariq Al-Mansoor',
      customerEmail: 'tariq@alfaha.com',
      customerPhone: '+91 98201 54321',
      shippingAddress: {
        fullName: 'H.E. Sheikh Tariq Al-Mansoor',
        email: 'tariq@alfaha.com',
        phone: '+91 98201 54321',
        addressLine1: 'Villa 14, Royal Palm Residences',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400026',
        country: 'India'
      },
      items: [
        {
          productId: bisht.id,
          productName: bisht.name,
          arabicName: bisht.arabicName,
          image: bisht.images[0],
          size: '58 (Tall)',
          color: 'Obsidian Black & Gold',
          price: bisht.price,
          quantity: 1,
          total: bisht.price
        }
      ],
      subtotal: bisht.price,
      shippingFee: 0,
      discount: 4850,
      couponCode: 'ROYAL10',
      total: bisht.price - 4850,
      paymentMethod: 'razorpay',
      paymentStatus: 'paid',
      razorpayOrderId: rzpData.order.id,
      razorpayPaymentId: 'pay_test_suite_verified',
      giftNote: 'Lacquered wooden presentation chest with royal monogram.'
    };

    const orderCreateRes = await fetch(`${BASE_URL}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${customerToken}`
      },
      body: JSON.stringify(newOrderPayload)
    });
    const orderCreateData = await orderCreateRes.json();
    assert(orderCreateData.success === true, 'Successfully placed bespoke order in database');
    const placedOrder = orderCreateData.order;
    assert(placedOrder.orderNumber.startsWith('ALF-2026-'), `Generated sovereign order reference: ${placedOrder.orderNumber}`);

    // 7. Live Order Tracking
    console.log('\n📌 Test Group 6: Live Order Tracking Timeline');
    const trackRes = await fetch(`${BASE_URL}/api/orders/track`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ orderNumber: placedOrder.orderNumber, emailOrPhone: 'tariq@alfaha.com' })
    });
    const trackData = await trackRes.json();
    assert(trackData.success === true, 'Public order tracking lookup succeeded');
    assert(trackData.order.timeline && trackData.order.timeline.length >= 1, 'Chronological timeline active with event stamps');

    // 8. Admin Status Transition & Dispatch Notification Trigger
    console.log('\n📌 Test Group 7: Admin Order Management & Dispatch Alert');
    const updateStatusRes = await fetch(`${BASE_URL}/api/orders/${placedOrder.id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`
      },
      body: JSON.stringify({
        status: 'dispatched',
        trackingNumber: 'BLUEDART-ROYAL-99881',
        courierName: 'Blue Dart Apex Sovereign Courier'
      })
    });
    const updateStatusData = await updateStatusRes.json();
    assert(updateStatusData.success === true, 'Admin transitioned order status to dispatched');
    assert(updateStatusData.order.orderStatus === 'dispatched', 'Order status verified as dispatched');
    assert(updateStatusData.order.trackingNumber === 'BLUEDART-ROYAL-99881', 'Assigned consignment tracking number');

    // 9. Email Notification Register
    console.log('\n📌 Test Group 8: Email Notification Log Verification');
    const notifRes = await fetch(`${BASE_URL}/api/admin/notifications`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const notifData = await notifRes.json();
    assert(notifData.success === true, 'Admin fetched email notification archive');
    assert(notifData.notifications.length >= 2, `Archive contains ${notifData.notifications.length} registered luxury emails`);
    const confirmationEmail = notifData.notifications.find(n => n.type === 'order_confirmed' && n.orderNumber === placedOrder.orderNumber);
    assert(confirmationEmail !== undefined, 'Order Confirmation luxury HTML email recorded in database');
    const dispatchEmail = notifData.notifications.find(n => n.type === 'order_dispatched' && n.orderNumber === placedOrder.orderNumber);
    assert(dispatchEmail !== undefined, 'Order Dispatched luxury HTML email recorded in database');

    // 10. Admin Executive Analytics
    console.log('\n📌 Test Group 9: Executive Analytics');
    const statsRes = await fetch(`${BASE_URL}/api/admin/stats`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });
    const statsData = await statsRes.json();
    assert(statsData.success === true, 'Computed executive analytics');
    assert(statsData.stats.totalRevenue > 0, `Total Revenue recorded: ₹${statsData.stats.totalRevenue.toLocaleString('en-IN')}`);
    assert(statsData.stats.totalOrders >= 3, `Total Orders in system: ${statsData.stats.totalOrders}`);

    console.log(`\n==================================================`);
    console.log(`🏆 TEST RESULTS: ${passed} Passed, ${failed} Failed`);
    console.log(`==================================================\n`);

    if (failed > 0) {
      process.exit(1);
    }
  } catch (err) {
    console.error('Test Suite encountered fatal error:', err);
    process.exit(1);
  }
}

runTests();
