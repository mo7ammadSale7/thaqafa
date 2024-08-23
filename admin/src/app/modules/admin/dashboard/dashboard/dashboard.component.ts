import { ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { ApexOptions } from 'apexcharts';
import { DashboardService } from './students.service';

@Component({
    selector: 'dashboard',
    templateUrl: './dashboard.component.html',
    encapsulation: ViewEncapsulation.None,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent {
    // chartGithubIssues: ApexOptions = {};
    studentYearCount: ApexOptions = {};
    data: any = [];
    myLabels: [];
    series: any = {};
    currentYear: string;
    yearTotal: any = {};

    /**
     * Constructor
     */
    constructor(
        private _router: Router,
        private _changeDetectorRef: ChangeDetectorRef,
        private dashboardService: DashboardService
    ) {
    }

    ngOnInit() {

        this.dashboardService.getYearsCount({}).subscribe((res) => {
            res.data.map((el: any, idx: number, arr: any[]) => {
                this.yearTotal[el['_id']] = el['total'];
                let data: any = [0, 0, 0, 0, 0, 0]
                el["levels"].map((level: any, idx: number) => {
                    switch (level['level']) {
                        case 1:
                            data[0] = level['count']
                            break;
                        case 2:
                            data[1] = level['count']
                            break;
                        case 3:
                            data[2] = level['count']
                            break;
                        case 4:
                            data[3] = level['count']
                            break;
                        case 5:
                            data[4] = level['count']
                            break;
                        case 6:
                            data[5] = level['count']
                            break;
                    }
                })
                this.series[el['_id']] = [{
                    name: 'عدد الطلاب',
                    type: 'line',
                    data: data
                }]
            });
            this.data = res.data;
            this.currentYear = this.data[this.data?.length - 1]['_id'];
            this._changeDetectorRef.markForCheck();
            // Prepare the chart data
            this._prepareChartData();
        })


        // Attach SVG fill fixer to all ApexCharts
        window['Apex'] = {
            chart: {
                events: {
                    mounted: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    },
                    updated: (chart: any, options?: any): void => {
                        this._fixSvgFill(chart.el);
                    }
                }
            }
        };
    }

    test(text) {
        console.log(text)
    }

    // -----------------------------------------------------------------------------------------------------
    // @ Private methods
    // -----------------------------------------------------------------------------------------------------

    /**
     * Fix the SVG fill references. This fix must be applied to all ApexCharts
     * charts in order to fix 'black color on gradient fills on certain browsers'
     * issue caused by the '<base>' tag.
     *
     * Fix based on https://gist.github.com/Kamshak/c84cdc175209d1a30f711abd6a81d472
     *
     * @param element
     * @private
     */
    private _fixSvgFill(element: Element): void {
        // Current URL
        const currentURL = this._router.url;

        // 1. Find all elements with 'fill' attribute within the element
        // 2. Filter out the ones that doesn't have cross reference so we only left with the ones that use the 'url(#id)' syntax
        // 3. Insert the 'currentURL' at the front of the 'fill' attribute value
        Array.from(element.querySelectorAll('*[fill]'))
            .filter(el => el.getAttribute('fill').indexOf('url(') !== -1)
            .forEach((el) => {
                const attrVal = el.getAttribute('fill');
                el.setAttribute('fill', `url(${currentURL}${attrVal.slice(attrVal.indexOf('#'))}`);
            });
    }

    /**
     * Prepare the chart data from the data
     *
     * @private
     */
    private _prepareChartData(): void {
        this.studentYearCount = {
            chart: {
                fontFamily: 'inherit',
                foreColor: 'inherit',
                height: '100%',
                type: 'line',
                toolbar: {
                    show: false
                },
                zoom: {
                    enabled: false
                }
            },
            colors: ['#64748B', '#94A3B8'],
            dataLabels: {
                enabled: true,
                enabledOnSeries: [0],
                background: {
                    borderWidth: 0
                }
            },
            grid: {
                borderColor: 'var(--fuse-border)'
            },
            labels: ['الأول', 'الثاني', 'الثالث', 'الرابع', 'الخامس', 'السادس'],
            legend: {
                show: false
            },
            plotOptions: {
                bar: {
                    columnWidth: '50%'
                }
            },
            series: this.series,
            states: {
                hover: {
                    filter: {
                        type: 'darken',
                        value: 0.75
                    }
                }
            },
            stroke: {
                width: [3, 0]
            },
            tooltip: {
                followCursor: true,
                theme: 'dark'
            },
            xaxis: {
                axisBorder: {
                    show: false
                },
                axisTicks: {
                    color: 'var(--fuse-border)'
                },
                labels: {
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                },
                tooltip: {
                    enabled: false
                }
            },
            yaxis: {
                labels: {
                    offsetX: -16,
                    style: {
                        colors: 'var(--fuse-text-secondary)'
                    }
                }
            }
        };

        this._changeDetectorRef.markForCheck();
    }

}
