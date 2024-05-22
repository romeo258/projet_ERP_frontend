export interface Stats {
  // Default statistics
  totalCustomers: number;
  totalInvoices: number;
  totalBilled: number;
  totalBenefit: number;
  totalUnpaid: number;
  totalUnpaidAmount: number;

  // Date specific
  totalCustomersDate: number;
  totalInvoicesDate: number;
  totalBilledDate: number;
  totalBenefitDate: number;
  totalUnpaidDate: number;
  totalUnpaidAmountDate: number;

  // Month Year specific
  totalCustomersMonthYear:  number;
  totalInvoicesMonthYear:  number;
  totalBilledMonthYear:  number;
  totalBenefitMonthYear:  number;
  totalUnpaidMonthYear:  number;
  totalUnpaidAmountMonthYear:  number;

  // Year specific
  totalCustomersYear:  number;
  totalInvoicesYear:  number;
  totalBilledYear:  number;
  totalBenefitYear:  number;
  totalUnpaidYear:  number;
  totalUnpaidAmountYear:  number;

  // Last 7 Days specific
  totalCustomersLastDays:  number;
  totalInvoicesLastDays:  number;
  totalBilledLastDays:  number;
  totalBenefitLastDays:  number;
  totalUnpaidLastDays:  number;
  totalUnpaidAmountLastDays:  number;

  
}
