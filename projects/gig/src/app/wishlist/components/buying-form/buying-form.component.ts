import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
} from '@angular/core';
import { Account } from '../../../services/accounts/account';
import { AccountsService } from '../../../services/accounts/accounts.service';
import { Expense } from '../../../services/expenses/expense';
import { ExpensesService } from '../../../services/expenses/expenses.service';
import { Wish } from '../../../services/wishlist/wish';
import { WishlistService } from '../../../services/wishlist/wishlist.service';
import { Option } from '../../../shared/components/dropdown-option-input/dropdown-option-input.component';

@Component({
    selector: 'gig-buying-form',
    templateUrl: './buying-form.component.html',
    styleUrls: ['./buying-form.component.css'],
})
export class BuyingFormComponent implements OnInit {
    @Input() wish!: Wish;

    @Input() displayBuying: boolean = false;
    @Output() displayBuyingChange = new EventEmitter<boolean>();

    @Output() dataChange: EventEmitter<any> = new EventEmitter();

    selectedType: Option = { label: '', value: '' };
    selectedAccount: Option = { label: '', value: '' };

    date: Date = new Date(Date.now());

    wishAccountOptions: Option[] = [];

    constructor(
        private wishService: WishlistService,
        private accountService: AccountsService,
        private expenseService: ExpensesService
    ) {}

    ngOnInit(): void {
        this.setAccountOptions();
    }

    dataChanged() {
        this.dataChange.emit(true);
    }

    setAccountOptions() {
        this.accountService.list().subscribe((data) => {
            data.forEach((a: Account) => {
                this.wishAccountOptions.push({ label: a.name, value: a._id });
            });
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        let wish = changes['wish'];
        console.log(wish);
        if (changes['wish'] && changes['wish'].currentValue._id) {
            console.log('entra');
            console.log(this.wishAccountOptions);
            let account = this.wishAccountOptions.find(
                (element: Option) =>
                    element.label == wish.currentValue.account.name
            );
            this.selectedAccount = { ...account };
        } else {
            this.selectedAccount = { label: '', value: '' };
        }
    }

    hideForm() {
        this.displayBuyingChange.emit(false);
    }

    save() {
        if (!this.wish._id && !this.selectedAccount) {
            let expense = new Expense(
                'Unico',
                this.wish.description,
                this.wish.category,
                this.date,
                this.selectedAccount,
                this.wish.total
            );
            expense.dateString = this.date.toLocaleDateString();
            this.expenseService.create(expense).subscribe(() => {
                this.dataChanged();
                this.wishService.delete(this.wish._id);
            });
        } else {
        }
        this.displayBuyingChange.emit(false);
    }

    setAccount(accountOption: any) {
        //this.wish.account = accountOption.value;
    }
}
